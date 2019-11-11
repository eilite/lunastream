import play.sbt.PlayImport

name := """lunastream"""
organization := "com.example"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.1"

libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.3" % Test
libraryDependencies += "com.sksamuel.elastic4s" %% "elastic4s-core" % "7.3.1"
libraryDependencies += "com.sksamuel.elastic4s" %% "elastic4s-client-esjava" % "7.3.1"
libraryDependencies += "com.sksamuel.elastic4s" %% "elastic4s-json-play" % "7.3.1"
libraryDependencies += "com.lightbend.akka" %% "akka-stream-alpakka-sse" % "1.1.2"