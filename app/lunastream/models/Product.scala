package lunastream.models

import play.api.libs.json.{Json, Format}
import play.api.libs.json.Writes
import java.time.LocalDateTime

case class Product(
  id: Int,
  ean: String,
  name: String,
  description: String,
  price: Option[BigDecimal],
  assembled: Boolean,
  weight: Double,
  dimension: Dimension
)

object Product {
  implicit val format: Format[Product] = Json.format[Product]
}

case class StoreProduct(
  store: Int,
  date: LocalDateTime,
  product: Product
)

object StoreProduct {
  implicit val format: Format[StoreProduct] = Json.format[StoreProduct]
}

case class PagedProducts(
  total: Long,
  from: Long,
  products: Seq[Product]
)

object PagedProducts {
  implicit val writes: Writes[PagedProducts] = Json.writes[PagedProducts]
}

case class TopProduct(
  numberOfProducts: Long,
  product: Product
)


object TopProduct {
  implicit val writes: Writes[TopProduct] = Json.writes[TopProduct]
}
