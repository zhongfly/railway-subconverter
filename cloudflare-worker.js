// 编辑为你的后端地址
const api = "https://your subconverter.up.railway.app";
// 设置被屏蔽的订阅链接黑名单
const blacklist = {"url":[
  /http(s)?:\/\/.*\.(now\.sh|vercel\.app)/,
  /(ss|free|proxy)\./,
  /\d+.xyz/,
  /\.(ml|cf|tk|ga|gq)/,
  /(ssr?|clash|v2ray|proxy)pool/,
  "githubusercontent",
  "github.com",
  "github.io",
  "gitlab.com",
  "bitbucket.org",
  "raw.fastgit.org",
  "jsdelivr.net",
  "herokuapp",
  "netlify",
  "railway.app",
  "workers.dev",
  "stgod",
  "lonxin",
  "linbaoz",
  "luoml"
  ]}; 
// 设置白名单IP
const whitelist = [ ".*" ];
addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

function isListed(uri,listing) {
    var ret=false;
    if (typeof uri == "string") {
        listing.forEach((m)=>{
	          if (uri.match(m)!=null) ret=true;
        });
    } else {            //   decide what to do when Origin is null
    	  ret=true;    // true accepts null origins false rejects them.
    }
    return ret;
}
/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
  var origin_url = new URL(request.url);
  var orig = request.headers.get("Origin");
  var sub_url = decodeURI(origin_url.searchParams.get("url")||"");
  console.log(sub_url);
  if ((!isListed(sub_url, blacklist.url)) && (isListed(orig, whitelist))) {
    let newreq = new Request(request,{
      "headers": request.headers
    });
    const { pathname, search } = origin_url;
    let fetch_url = api + pathname + search;
    //console.log(fetch_url);
    let response = await fetch(fetch_url,newreq);
    let myHeaders = new Headers(response.headers);
    cors_headers = [];
    allh = {};
    for (var pair of response.headers.entries()) {
        cors_headers.push(pair[0]);
        allh[pair[0]] = pair[1];
    }
    cors_headers.push("cors-received-headers");
    myHeaders.set("Access-Control-Allow-Origin", request.headers.get("Origin"));

    myHeaders.set("Access-Control-Expose-Headers", cors_headers.join(","));

    myHeaders.set("cors-received-headers", JSON.stringify(allh));
    let body = await response.arrayBuffer();
    var init = {
        headers: myHeaders,
        status: response.status,
        statusText: response.statusText
    };
    return new Response(body,init);
  } else {
    return new Response(
    `
    <!doctype html><html lang="zh-cn"><head><meta charset="utf-8"></head>
    <body>
    请自行搭建订阅转换接口</br>\n本转换接口仅用于测试或个人使用</br>\n您被本转换接口屏蔽的原因可能有：过于频繁的请求、请求保存在Github上的节点池等</br>\n
    </body>
    </html>`,
    {
        status: 403,
        statusText: 'Forbidden',
        headers: {
            "Content-Type": "text/html"
        }
    });
  }
}
