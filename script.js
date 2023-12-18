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

// 获取页面中的元素
const daysCountElement = document.getElementById('days-count');

// 更新页面中的网站运行天数
async function updateDaysRunning() {
  const daysRunning = await calculateDaysRunning();
  daysCountElement.textContent = daysRunning;
}

// 页面加载完成后执行更新
document.addEventListener('DOMContentLoaded', updateDaysRunning);
