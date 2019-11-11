package lunastream.clients

import play.api.Configuration
import scala.concurrent.Future
import play.api.libs.json.Json

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.stream.alpakka.sse.scaladsl.EventSource
import akka.stream.Materializer
import akka.stream.scaladsl.Source

import lunastream.models.Product
import play.api.libs.json.JsSuccess
import scala.util.Try
import scala.util.Success
import scala.util.Failure
import akka.http.scaladsl.model.headers.RawHeader

class LunafactoryClient(
  configuration: Configuration
)(
  implicit actorSystem: ActorSystem, mateializer: Materializer
) {
  private val baseUrl = configuration.get[String]("lunafactory.baseurl")
  private val token = configuration.get[String]("lunafactory.token")

  private val send: HttpRequest => Future[HttpResponse] = request =>
    Http().singleRequest(request.withHeaders(Seq(RawHeader("X-API-LunaFactory", token))))

  def products(store: Int) = EventSource(
    uri = Uri(s"$baseUrl/purchase/$store"),
    send
  ).collect[Seq[Product]] { event =>
    Try(Json.parse(event.data)).map(_.validate[Seq[Product]]) match {
      case Success(JsSuccess(products, _)) => products
      case Failure(_) => Seq.empty
    }
  }
}