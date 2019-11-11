package lunastream.services

import akka.stream.scaladsl._
import akka.stream.Materializer
import akka.NotUsed
import akka.actor.ActorRef

import scala.concurrent.ExecutionContext

import lunastream.actors.MasterActor
import lunastream.persistence.ProductsRepository
import lunastream.clients.LunafactoryClient
import lunastream.models.{Product, StoreProduct}
import java.time.LocalDateTime

class LunafactoryStreamRunner(
  lunafactoryClient: LunafactoryClient,
  productRepository: ProductsRepository,
  mainActorRef: ActorRef
)(
  implicit ec: ExecutionContext, materializer: Materializer
) {
  private val actorSink: Sink[(Int, Seq[Product]), NotUsed] = Sink.actorRefWithAck[(Int, Seq[Product])](
    mainActorRef,
    onInitMessage = MasterActor.StreamInitialized,
    ackMessage = MasterActor.Acknowledged,
    onCompleteMessage = MasterActor.StreamCompleted,
    onFailureMessage = (ex: Throwable) => MasterActor.StreamFailure(ex)
  )

  private val persistSink: Sink[(Int, Seq[Product]), NotUsed] = Flow.fromFunction[(Int, Seq[Product]), Seq[StoreProduct]] { 
    case (store, products) => products.map( p => StoreProduct(store, LocalDateTime.now(), p))
  }.to(Sink.foreach(productRepository.persist))

  private def storeSource(store: Int) = lunafactoryClient.products(store).map(store -> _)

  def run() = Source
    .combine(storeSource(0), storeSource(1))(Merge(_))
    .runWith(Sink.combine(actorSink, persistSink)(Broadcast(_)))
}