# railway-subconverter
在Railway.app上搭建subconverter

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fzhongfly%2Frailway-subconverter&referralCode=y7njpi)

将配置文件等放在files/文件夹内

需要更新sub-web、subconverter时运行相应的action即可

Railway.app可能在国内打开困难，可以自行架设cloudflare worker作为中转代理，同时限制他人对接口的滥用：

1. 复制cloudflare-worker.js中的内容到cloudflare worker编辑页面中，并且修改1-27行（有注释）

1. 修改第2行的网址为你的Railway后端地址（不带末尾的/斜杠）

1. 匹配黑名单内中的关键词或正则的订阅网址会被屏蔽，默认禁用节点池网站以及放在github上的订阅链接

1. 只有白名单中的IP会被允许使用（这功能好像没用）
