const { JSDOM } = require('jsdom');
const { createCanvas } = require('canvas');
const echarts = require('echarts');
const fs = require('fs');
const path = require('path');

// 创建输出目录（如果不存在）
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 模拟浏览器环境
const dom = new JSDOM('<!DOCTYPE html><body><div id="chart-container"></div></body>');
const { window } = dom;
const { document } = window;

// 配置Canvas环境
const canvas = createCanvas(800, 600);
window.CanvasRenderingContext2D = canvas.getContext('2d').constructor;
window.HTMLCanvasElement = canvas.constructor;

// 为全局对象添加必要的属性
global.window = window;
global.document = document;
global.navigator = window.navigator;

// 创建图表容器并设置样式
const container = document.getElementById('chart-container');
container.style.width = '800px';
container.style.height = '600px';

// 初始化ECharts实例
const chart = echarts.init(container, null, {
  renderer: 'canvas',
  width: 800,
  height: 600,
  devicePixelRatio: 2 // 提高图片清晰度
});

// 图表配置项
const option = {
  title: {
    text: 'Node.js ECharts 测试图表',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['销量', '增长率'],
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['一月', '二月', '三月', '四月', '五月', '六月']
  },
  yAxis: [
    {
      type: 'value',
      name: '销量',
      axisLabel: {
        formatter: '{value} 件'
      }
    },
    {
      type: 'value',
      name: '增长率',
      axisLabel: {
        formatter: '{value}%'
      }
    }
  ],
  series: [
    {
      name: '销量',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230],
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      }
    },
    {
      name: '增长率',
      type: 'line',
      yAxisIndex: 1,
      data: [12, 18, 9, 15, 8, 22],
      lineStyle: {
        type: 'dashed'
      }
    }
  ],
  animation: false // 关闭动画以提高生成速度
};

// 设置图表配置并生成图片
chart.setOption(option);

// 导出图片
const imageData = chart.getDataURL({
  type: 'png',
  pixelRatio: 2,
  backgroundColor: '#ffffff'
});

// 解析Base64数据并保存为文件
const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
const outputPath = path.join(outputDir, 'echarts-chart.png');

fs.writeFile(outputPath, base64Data, 'base64', (err) => {
  if (err) {
    console.error('生成图片失败:', err);
  } else {
    console.log(`图片已成功生成: ${outputPath}`);
  }
  
  // 释放资源
  chart.dispose();
});
