# fancy_LVB_Telegram_Bot

### config.js file

The Telegram token is stored in a file named _config.js_. This file is ignored by git, so you have to create your own config file with your own token. Here is an example.

```js
var config = {}

config.TELEGRAM_TOKEN = '000000000:xxxxxxxxxxxxxxxxxxxxx'

module.exports = config;
```