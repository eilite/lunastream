package lunastream.controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.Json
import play.api.libs.EventSource
import play.api.http.ContentTypes

import akka.stream.scaladsl.{Sink, Source}
import akka.actor.ActorRef
import akka.stream.OverflowStrategy
import akka.stream.Materializer
import scala.concurrent.{ExecutionContext, Future}

import lunastream.actors.MasterActor
import lunastream.models.Product
import lunastream.persistence.ProductsRepository

class ProductsController(
  cc: ControllerComponents,
  mainActor: ActorRef,
  productsRepository: ProductsRepository
)(
  implicit ec: ExecutionContext, materializer: Materializer
) extends AbstractController(cc) {

  def index(page: String) = Action { implicit request: Request[AnyContent] =>
    Ok(lunastream.views.html.index())
  }

  def streamProducts(store: Option[Int]) = Action {
    val matValuePoweredSource = Source.actorRef[Seq[Product]](bufferSize = Int.MaxValue, overflowStrategy = OverflowStrategy.fail)
    
    val (actorRef, source) = matValuePoweredSource.preMaterialize()
    mainActor ! MasterActor.Subscribe(store, actorRef)

    val sseSource = (source.map(Json.toJson(_)) via EventSource.flow)
      .alsoTo(Sink.onComplete(_ => mainActor ! MasterActor.Unsubscribe(actorRef)))
    Ok.chunked(sseSource).as(ContentTypes.EVENT_STREAM)
  }

  def searchProducts(store: Option[Int], q: Option[String], from: Option[Int], size: Option[Int]) = Action.async {
    productsRepository.searchProducts(store, q, size, from)
    .map(results => Ok(Json.toJson(results)))
  }

  def topProducts(store: Option[Int], number: Int) = Action.async {
    productsRepository.topProducts(store, number)
    .map(results => Ok(Json.toJson(results)))
  }

}
