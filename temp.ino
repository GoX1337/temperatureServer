#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define SERVER_URL "http://localhost:3000/temperature"
#define DHTTYPE DHT22
const uint8_t D0 = 5;
DHT dht(D0, DHTTYPE);                
float temperature;
float humidity;

void setup() {
  Serial.begin(115200);
  Serial.println();
  pinMode(LED_BUILTIN, OUTPUT); 
  wifiConnect();
  dht.begin();
  temperature = dht.readTemperature();
  humidity = dht.readHumidity(); 
  printDatas(temperature, humidity);
  digitalWrite(LED_BUILTIN, LOW);
  sendData(temperature, humidity);
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.print("Deep sleep");
  ESP.deepSleep(1830 * 1000000, WAKE_RF_DEFAULT); 
}

void wifiConnect() {
  WiFi.begin("Livebox", "XXXXXXXXXXX");
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
}

void printDatas(float temperature, float humidity) {
  Serial.println("------------------------");
  Serial.print("Temperature: ");
  Serial.println(temperature);
  Serial.print("Humidity: ");
  Serial.println(humidity);
  Serial.println("------------------------");
}

String buildJsonBody(float temperature, float humidity) {
  StaticJsonDocument<200> requestBody;
  requestBody["temperature"] = temperature;
  requestBody["humidity"] = humidity;
  String output;
  serializeJson(requestBody, output);
  return output;
}

void sendData(float temperature, float humidity) {
  WiFiClient client;
  HTTPClient http;

  Serial.print("[HTTP] begin...\n");
  // configure traged server and url
  http.begin(client, SERVER_URL); //HTTP
  http.addHeader("Content-Type", "application/json");
  Serial.print("[HTTP] POST...\n");
  // start connection and send HTTP header and body
 
  int httpCode = http.POST(buildJsonBody(temperature, humidity));

  // httpCode will be negative on error
  if (httpCode > 0) {
    // HTTP header has been send and Server response header has been handled
    Serial.printf("[HTTP] POST... code: %d\n", httpCode);

    // file found at server
    if (httpCode == HTTP_CODE_OK) {
      const String& payload = http.getString();
      Serial.println("received payload:\n<<");
      Serial.println(payload);
      Serial.println(">>");
    }
  } else {
    Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
}