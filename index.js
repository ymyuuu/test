addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function calculateDaysRunning() {
  const startDate = new Date('2023-11-11T00:00:00+08:00');
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - startDate.getTime();
  const daysRunning = Math.floor(timeDifference / (1000 * 3600 * 24));
  return daysRunning;
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const cfWorkersUrl = 'http://speed.cloudflare.com/__down';
  const param = url.pathname.split('/').pop();
  let bytesParam = 0;

  if (param === '') {
    // 返回帮助文档页面
    return new Response(await getHTMLContent(), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    });
  }

  // 解析路径中的参数以确定字节大小
  if (param.endsWith('kb')) {
    const kbValue = parseFloat(param.replace('kb', ''));
    bytesParam = kbValue * 1024;
  } else if (param.endsWith('mb')) {
    const mbValue = parseFloat(param.replace('mb', ''));
    bytesParam = mbValue * 1024 * 1024;
  } else if (param.endsWith('gb')) {
    const gbValue = parseFloat(param.replace('gb', ''));
    bytesParam = gbValue * 1024 * 1024 * 1024;
  } else if (!isNaN(parseInt(param, 10))) {
    bytesParam = parseInt(param, 10);
  } else {
    // 如果参数无效，则返回帮助文档页面
    return new Response(await getHTMLContent(), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    });
  }

  const targetUrl = `${cfWorkersUrl}?bytes=${bytesParam}`;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      ...request.headers,
      'Cache-Control': 'no-store',
    },
    body: request.method !== 'GET' ? request.body : undefined,
  });

  return response;
}

async function getHTMLContent() {
  // 读取 HTML 文件内容
  const htmlPath = 'index.html'; // 修改此处为你的 HTML 文件路径
  const htmlResponse = await fetch(htmlPath);
  return await htmlResponse.text();
}
