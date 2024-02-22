import mqtt from "mqtt";

export const mqttClient = mqtt.connect({
  protocol: "mqtts",
  hostname: "huna-emqx",
  port: 8883,
  ca: process.env.EMQX_CA_CRT,
  cert: process.env.EMQX_CLIENT_CRT,
  clean: true,
  key: process.env.EMQX_CLIENT_KEY,
  protocolVersion: 5,
  clientId: process.env.HOSTNAME ||
    "huna-detection_" + Math.random().toString(16).substr(2, 8),
});

mqttClient.on("connect", () => {
  console.log("MQTT connected");
});

mqttClient.on("reconnect", () => {
  console.log("MQTT reconnected");
});

mqttClient.on("disconnect", () => {
  console.log("MQTT disconnected");
});

mqttClient.on("close", () => {
  console.log("MQTT closed");
});
