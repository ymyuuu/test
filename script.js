// 图片数组
const images = [
	'https://im.030101.xyz/file/fcce5bae2f1d8b791ab6e.jpg',
	'https://im.030101.xyz/file/b09301c5b252d8da0f6c6.jpg',
	'https://im.030101.xyz/file/a806e5cd3d19f54112191.jpg',
	'https://im.030101.xyz/file/e52483ddf724c5c64c360.jpg',
	'https://im.030101.xyz/file/2d5ff3b8aff117d6cd23f.jpg',
	'https://im.030101.xyz/file/c6c8054aec11379eaa53a.jpg',
	'https://im.030101.xyz/file/c31adb6592a223cb53ca7.jpg'
];
// 计算时间差函数
function getTimeDifference(start, end) {
	const difference = end.getTime() - start.getTime();
	const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
	return daysDifference;
}

// 你们在一起的起始时间
const startDate = new Date('2021-12-02'); // 替换成实际的起始时间

// 当前时间
const currentDate = new Date();

// 计算时间差
const timeDifference = getTimeDifference(startDate, currentDate);

// 获取显示时间的元素
const timeTogetherElement = document.getElementById('timeTogether');

// 设置显示的时间内容
timeTogetherElement.innerHTML =
	`Days ${timeDifference} together, I <a href="https://push.zzy.cloudns.biz/" class="no-underline" target="_blank">miss you.</a> `;

// 随机选择图片
const randomIndex = Math.floor(Math.random() * images.length);
const randomImageElement = document.getElementById('randomImage');
randomImageElement.src = images[randomIndex];
