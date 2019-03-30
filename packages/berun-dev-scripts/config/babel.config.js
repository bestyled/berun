module.exports =  {
    "presets": [
      "@babel/preset-typescript",
      [
        "@babel/preset-env",
        {
          "targets": {
            "node": "8.3"
          }
        }
      ]
    ],
    "plugins": [  
             ["@babel/plugin-proposal-decorators", { "legacy": true }],
             ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
}