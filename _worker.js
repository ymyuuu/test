addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})

// 计算网站运行天数的异步函数
async function calculateDaysRunning() {
	// 网站启动日期（北京时间）
	const startDate = new Date('2023-11-11T00:00:00+08:00');
	// 当前日期（北京时间）
	const currentDate = new Date();
	// 计算时间差
	const timeDifference = currentDate.getTime() - startDate.getTime();
	// 计算运行天数
	const daysRunning = Math.floor(timeDifference / (1000 * 3600 * 24));
	return daysRunning;
}

// 处理传入请求的函数
async function handleRequest(request) {
	// 解析请求的 URL
	const url = new URL(request.url)
	const cfWorkersUrl = 'http://speed.cloudflare.com/__down'
	const param = url.pathname.split('/').pop() // 获取 URL 路径中的参数
	let bytesParam = 0

	// 定义 HTML 页面内容，包含暗黑模式和浅色模式样式
	let responseText = `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
			<title>Speed URL</title>
			<link rel="icon" type="image/png"
				href="https://cdn.jsdelivr.net/gh/png-dot/pngpng@main/20231120-233256-ajjzpm.png">
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #F5F5F5;

				}

				a {
					color: #9db4ff;
					text-decoration: none; /* 去掉下划线 */
				  }				  

				code {
					background-color: #eee;
					padding: 2px 5px;
					border-radius: 3px;
				}

				p {
					margin-bottom: 15px;
				}

				li {
					margin-bottom: 5px;
				}

				/* 暗黑模式 */
				@media (prefers-color-scheme: dark) {
					body {
						background-color: #333;
						color: #f0f0f0;
					}

					code {
						background-color: #444;
						padding: 2px 5px;
						border-radius: 3px;
					}
				}
			</style>
		</head>
		<body>
			<!-- 页面内容 -->
			<h1 style="font-size: 30px;">Download speed measurement URL for <span
					style="text-decoration: underline; cursor: pointer;"
					onclick="window.open('https://github.com/ymyuuu', '_blank')">Mingyu</span></h1>
			<h2>Help Documents:</h2>
			<p>若要指定字节数，请使用格式：<code>${url.origin}/数字</code></p>
			<p>若要指定以千字节为单位，请使用格式：<code>${url.origin}/数字kb</code></p>
			<p>若要指定以兆字节为单位，请使用格式：<code>${url.origin}/数字mb</code></p>
			<p>若要指定以千兆字节为单位，请使用格式：<code>${url.origin}/数字gb</code></p>
			<h3>示例：</h3>
			<ul>
				<li>要下载 10000 字节：<a href="${url.origin}/10000">${url.origin}/10000</a></li>
				<li>要下载 10 千字节：<a href="${url.origin}/10kb">${url.origin}/10kb</a></li>
				<li>要下载 5 兆字节：<a href="${url.origin}/5mb">${url.origin}/5mb</a></li>
				<li>要下载 2 千兆字节：<a href="${url.origin}/2gb">${url.origin}/2gb</a></li>
			</ul>
			<p>在某些国家或地区，由于网络限制或连接限制，可能会影响下载速度或导致下载不稳定。特别地，在中国境内可能会遇到较慢的下载速度或无法连接到服务的情况。</p>
			<p>如果您在国内使用时遇到问题，您可以尝试以下解决方案：</p>
			<ul>
				<li>使用 VPN 或代理，连接到其他国家的网络，然后再进行下载</li>
				<li>考虑其他本地化的服务或下载方式，以获得更稳定和快速的下载体验</li>
			</ul>
			<h2>Website has been running stably for ${await calculateDaysRunning()} days 🎉</h2> <!-- 修改成英文 -->
		</body>
	</html>
	`

	// 如果路径参数为空，则返回帮助文档页面
	if (param === '') {
		return new Response(responseText, {
			status: 200,
			headers: {
				'Content-Type': 'text/html; charset=UTF-8'
			}
		})
	}

	// 解析路径中的参数以确定字节大小
	if (param.endsWith('kb')) {
		const kbValue = parseFloat(param.replace('kb', ''))
		bytesParam = kbValue * 1024
	} else if (param.endsWith('mb')) {
		const mbValue = parseFloat(param.replace('mb', ''))
		bytesParam = mbValue * 1024 * 1024
	} else if (param.endsWith('gb')) {
		const gbValue = parseFloat(param.replace('gb', ''))
		bytesParam = gbValue * 1024 * 1024 * 1024
	} else if (!isNaN(parseInt(param, 10))) {
		bytesParam = parseInt(param, 10) // 将字符串参数转换为数字
	} else {
		// 如果参数无效，则返回帮助文档页面
		return new Response(responseText, {
			status: 200,
			headers: {
				'Content-Type': 'text/html; charset=UTF-8'
			}
		})
	}

	// 构建新的目标 URL
	const targetUrl = `${cfWorkersUrl}?bytes=${bytesParam}`

	// 向目标 URL 发送请求，禁用缓存
	const response = await fetch(targetUrl, {
		method: request.method,
		headers: {
			...request.headers,
			'Cache-Control': 'no-store', // 禁用缓存
		},
		body: request.method !== 'GET' ? request.body : undefined,
	})

	// 返回从目标 URL 收到的响应
	return response
}
