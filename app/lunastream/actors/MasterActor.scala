package lunastream.actors

import akka.actor.{ Actor, ActorLogging, ActorSystem, Props }

import _root_.lunastream.models.StoreProduct
import akka.actor.ActorRef

import scala.collection.mutable.Set

object MasterActor {
  case object Acknowledged

  case object StreamInitialized
  case object StreamCompleted
  final case class StreamFailure(ex: Throwable)

  final case class Subscribe(store: Option[Int], actorRef: ActorRef)
  final case class Unsubscribe(actorRef: ActorRef)
}

class MasterActor() extends Actor with ActorLogging {
  import MasterActor._
  var subscibers: Set[(Option[Int], ActorRef)] = Set.empty
  
  def receive: Actor.Receive = {

    case StreamInitialized =>
    log.info("Stream initialized")
      sender() ! Acknowledged

    case (store: Int, products: Seq[Product]) =>
      log.info(s"received ${products.length} product from store $store")
      val sendTo = subscibers
        .collect { case (subscriberStore, ref) if subscriberStore.contains(store) || subscriberStore.isEmpty => ref }
      log.info(s"sending products to ${sendTo}")
      
      sendTo.foreach { _ ! products }
      sender() ! Acknowledged

    case StreamCompleted =>
      log.info("Stream completed!")


    case StreamFailure(ex) =>
      log.error(ex, "Stream failed!")

    case Subscribe(store, ref) =>
      subscibers.add(store -> ref)
    case Unsubscribe(ref) =>
      log.info(s"remove $ref from subscribers")
      subscibers = subscibers.dropWhile { case (_, actor) => actor == ref }
    case message               => log.error(s"unhandled message : $message") 
  }
}