package lunastream.persistence

import akka.actor.ActorSystem

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

import com.sksamuel.elastic4s.{ElasticClient, Response}
import com.sksamuel.elastic4s.ElasticDsl._
import com.sksamuel.elastic4s.playjson._
import com.sksamuel.elastic4s.requests.bulk.BulkResponse
import com.sksamuel.elastic4s.requests.searches.queries.term.TermQuery
import com.sksamuel.elastic4s.requests.searches.aggs.{ TermsAggregation, TopHitsAggregation }
import com.sksamuel.elastic4s.requests.searches.sort.SortOrder.Desc
import com.sksamuel.elastic4s.requests.searches.sort.FieldSort
import com.sksamuel.elastic4s.requests.searches.SearchResponse
import com.sksamuel.elastic4s.RequestSuccess
import com.sksamuel.elastic4s.RequestFailure

import lunastream.models.{PagedProducts, Product, StoreProduct, TopProduct}

class ProductsRepository(
  esClient: ElasticClient
)(
  implicit ec: ExecutionContext, actorSystem: ActorSystem
) {

  def persist(products: Seq[StoreProduct]): Future[Response[BulkResponse]] = esClient.execute(
    bulk(products.map(product => indexInto("products").doc(product)))
  )

  def searchProducts(store: Option[Int], query: Option[String], mSize: Option[Int], mFrom: Option[Int]): Future[PagedProducts] = {
    val from = mFrom.getOrElse(0)
    val size = mSize.getOrElse(20)
    
    esClient.execute(
      search("products").query(
        must(
          Seq(
            store.map(s => termQuery("store", s)),
            query.map(q => simpleStringQuery(q))
          ).flatten
        )
      ).start(from).limit(size)
    ).flatMap(processSearchProductsResponse(_, from))
  }

  private def processSearchProductsResponse(response: Response[SearchResponse], from: Int): Future[PagedProducts] =
    response.map(r => (r.hits.total.value -> traverse(r.safeTo[StoreProduct]))) match {
    case RequestSuccess(_, _, _, (nbHits, Success(products))) =>
      Future.successful(PagedProducts(nbHits, from, products.map(_.product)))
    case RequestSuccess(_, _, _, (_, Failure(error))) =>
      Future.failed(error)
    case RequestFailure(status, body, headers, error) =>
      Future.failed(error.asException)
  }

  private def traverse[A](tries: Seq[Try[A]]): Try[Seq[A]] = tries.foldLeft[Try[Seq[A]]](Success(Seq.empty)) {
    case (Success(trySeq), Success(value))   => Success(trySeq :+ value)
    case (_, Failure(error))                 => Failure(error)
    case (failure@Failure(_), _)             => failure
  }

  def topProducts(store: Option[Int], numberOfProducts: Int): Future[Seq[TopProduct]] = {
    esClient.execute(
      search("products")
      .query(
        must(
          store
          .map(s => termQuery("store", s)).map(Seq(_))
          .getOrElse(Seq.empty)
        )
      )
      .size(0)
      .aggregations(
        TermsAggregation(
          name = "top_products",
          field = Some("product.id"),
          size = Some(numberOfProducts),
          subaggs = Seq(
            TopHitsAggregation(
              name = "top_products_hits",
              sorts = Seq(FieldSort("date", order = Desc)),
              size = Some(1)
            )
          )
        )
      )
    )
    .flatMap(proccessTopResultsResponse)
  }

  private def proccessTopResultsResponse(response: Response[SearchResponse]): Future[Seq[TopProduct]] = {
    val parsedAggregation = response.map[Try[Seq[TopProduct]]] { searchResponse =>
      traverse(
        searchResponse.aggregations.terms("top_products").buckets.flatMap { bucket =>
          val tophits = bucket.tophits("top_products_hits")
          tophits.hits.map{hit => hit.safeTo[StoreProduct].map(sp => TopProduct(tophits.total.value, sp.product))}
        })
    }
    parsedAggregation match {
      case RequestSuccess(status, body, headers, Success(tops)) =>
        Future.successful(tops)
      case RequestSuccess(status, body, headers, Failure(exception)) =>
        Future.failed(exception)
      case RequestFailure(status, body, headers, error) =>
        Future.failed(error.asException)
    }
  }

}