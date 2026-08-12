package com.rmrdo.devforge.api.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
/** DevForge 백엔드 API 명세서를 보여주는 Scalar API Reference UI를 제공한다. Swagger 대신 Scalar를 사용한다. */
public class ScalarDocController {

    @GetMapping(value = "/docs", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> renderScalarDocs() {
        String html = """
                <!doctype html>
                <html>
                  <head>
                    <title>DevForge API Documentation - Scalar</title>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
                    <style>
                      body {
                        margin: 0;
                        padding: 0;
                        background: #0f172a;
                      }
                    </style>
                  </head>
                  <body>
                    <script
                      id="api-reference"
                      data-url="/v3/api-docs"
                      data-proxy-url="https://proxy.scalar.com"
                      src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
                  </body>
                </html>
                """;
        return ResponseEntity.ok(html);
    }
}
