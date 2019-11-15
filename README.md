## Getting Started
This app consumes a stream of products from an API, stores the products in Elasticsearch to make them searchable and then streams them to the client.

The client shows the live products as they arrive and also has a search page to search the products. There is also a top products page that displays the more sold products.

### Prerequisites

To run this project, you  need to have those environment variables set:
-  `LUNAFACTORY_TOKEN` : the token used to make requests to the lunfactory API
```
export LUNAFACTORY_TOKEN=token_value
```
You also need to following tools installed :
```
docker
yarn
sbt
```

### Installing
Here are the following steps to run this app :

Start elasticsearch :
```
cd dev/docker && docker-compose up
```

Build the client :
```
yarn install
yarn run build
```

Start the server :

```
export LUNAFACTORY_TOKEN=token_value
sbt run
```

You can run the app on `localhost:9000`

### Technologies used 

#### backend 
- [sbt](https://www.scala-sbt.org/)
- [play framework](https://www.playframework.com/)
- [akka streams](https://doc.akka.io/docs/akka/current/stream/index.html)
- [elasticsearch](https://www.elastic.co/products/elasticsearch)
- [elastic4S](https://github.com/sksamuel/elastic4s)

#### frontend
- [reactjs](https://reactjs.org/)
- [react-router](https://reacttraining.com/react-router/)
- [typescript](https://www.typescriptlang.org/)
- [antd](https://ant.design/)
- [webpack](https://webpack.js.org/)
- [stylus](http://stylus-lang.com/)
