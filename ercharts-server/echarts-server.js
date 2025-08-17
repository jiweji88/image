const express = require('express');
const { JSDOM } = require('jsdom');
const { createCanvas } = require('canvas');
const app = express();
const port = process.env.PORT || 3000;

// ********** 关键修改：在引入echarts之前先设置全局window对象 **********
// 基础浏览器环境模拟（供echarts初始化使用）
const baseDom = new JSDOM('<!DOCTYPE html><body></body>');
const { window: baseWindow } = baseDom;

// 设置全局变量
global.window = baseWindow;
global.document = baseWindow.document;
global.navigator = baseWindow.navigator;
global.screen = {
    width: 1920,
    height: 1080
};

// 现在再引入echarts
const echarts = require('echarts');

// 解析JSON请求体
app.use(express.json());

// 为每个请求创建独立的浏览器环境
function setupBrowserEnv(width = 800, height = 600) {
    // 创建新的DOM实例，避免请求间的污染
    const dom = new JSDOM('<!DOCTYPE html><body><div id="chart-container"></div></body>');
    const { window } = dom;
    const { document } = window;

    // 配置Canvas环境
    const canvas = createCanvas(width, height);
    window.CanvasRenderingContext2D = canvas.getContext('2d').constructor;
    window.HTMLCanvasElement = canvas.constructor;

    // 为当前环境设置必要的属性
    window.navigator = baseWindow.navigator;
    window.screen = {
        width: 1920,
        height: 1080
    };

    // 创建图表容器并设置样式
    const container = document.getElementById('chart-container');
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;

    return { window, document, container };
}

// 生成图表的函数
function generateChart(option, width = 800, height = 600) {
    try {
        // 为当前请求设置独立的浏览器环境
        const { window, container } = setupBrowserEnv(width, height);
        
        // 临时将当前请求的window设为全局，供echarts使用
        const originalWindow = global.window;
        global.window = window;

        // 初始化ECharts实例
        const chart = echarts.init(container, null, {
            renderer: 'canvas',
            width: width,
            height: height,
            devicePixelRatio: 2 // 提高图片清晰度
        });

        // 关闭动画以提高生成速度
        if (option.animation !== false) {
            option.animation = false;
        }

        // 设置图表配置
        chart.setOption(option);

        // 导出图片为base64
        const imageData = chart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#ffffff'
        });

        // 释放资源
        chart.dispose();
        
        // 恢复全局window
        global.window = originalWindow;

        return imageData;
    } catch (error) {
        console.error('生成图表失败:', error);
        throw error;
    }
}

// POST接口：接收图表配置，返回图片base64
app.post('/generate-chart', (req, res) => {
    try {
        // 从请求体获取图表配置和尺寸
        const { option, width, height } = req.body;

        // 验证必要参数
        if (!option) {
            return res.status(400).json({
                success: false,
                error: '缺少图表配置参数(option)'
            });
        }

        // 生成图表
        const base64Image = generateChart(option, width || 800, height || 600);

        // 返回结果
        res.json({
            success: true,
            image: base64Image
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 启动服务
app.listen(port, () => {
    console.log(`ECharts图表生成服务已启动，监听端口: ${port}`);
    console.log(`可发送POST请求到 http://localhost:${port}/generate-chart`);
});
