import akka.actor.{ActorSystem, Props}
import akka.stream.scaladsl._
import akka.NotUsed

import play.api._
import play.api.ApplicationLoader.Context
import play.filters.HttpFiltersComponents
import play.api.i18n.I18nComponents
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents, PlayBodyParsers, Request}
import play.api.libs.json.Json

import router.Routes

import _root_.controllers.AssetsComponents
import lunastream.actors.MasterActor
import lunastream.models.StoreProduct
import lunastream.models.Product

import com.sksamuel.elastic4s.http.JavaClient
import com.sksamuel.elastic4s.ElasticDsl._
import scala.concurrent.Future
import com.sksamuel.elastic4s.{ElasticClient, ElasticNodeEndpoint, ElasticProperties}

class AppComponents(context: ApplicationLoader.Context)
  extends BuiltInComponentsFromContext(context)
  with AssetsComponents
  with I18nComponents
  with ControllerComponents
  with HttpFiltersComponents {

  implicit val ac: ActorSystem = actorSystem
  override implicit lazy val executionContext = actorSystem.dispatcher

  override def parsers: PlayBodyParsers = parse
  override def actionBuilder: ActionBuilder[Request, AnyContent] = Action

  lazy val endpoint = ElasticNodeEndpoint("http", configuration.get[String]("es.host"), configuration.get[Int]("es.port"), None)
  lazy val esClient = ElasticClient(JavaClient(ElasticProperties(Seq(endpoint))))

  lazy val productRepository = new lunastream.persistence.ProductsRepository(esClient)

  lazy val productsController = new lunastream.controllers.ProductsController(controllerComponents, masterActor, productRepository)
  lazy val lunafactoryClient = new lunastream.clients.LunafactoryClient(configuration)
  lazy val router = new Routes(httpErrorHandler, productsController, assets)


  lazy val masterActor = actorSystem.actorOf(Props(new MasterActor()), "main-actor")

  lazy val lunafactoryStreamRunner = new lunastream.services.LunastreamRunner(
    lunafactoryClient, productRepository, masterActor
  )

  lunafactoryStreamRunner.run()

  


}