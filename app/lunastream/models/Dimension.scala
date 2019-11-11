package lunastream.models

import play.api.libs.json.{ Format, Json }

case class Dimension(
  width: Double,
  depth: Double,
  height: Double
)

object Dimension {
  implicit val format: Format[Dimension] = Json.format[Dimension]
}
