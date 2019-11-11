package lunastream.models
import scala.util.control.NoStackTrace

sealed trait ApiError extends Throwable with NoStackTrace {
  val status: Int
  val message: Option[String]
}

case class LunafactoryClientError(
  val status: Int,
  val message: Option[String]
) extends ApiError
