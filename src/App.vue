<template>
  <div id="app">
    <div class="top">
      <!-- 左上四格 -->
      <div class="t-left">
        <div class="numboxs">
          <div class="num">
            <div class="num-name">话务量</div>
            <div class="num-value">{{commonStatistic.callAmount}}</div>
          </div>
          <div class="num">
            <div class="num-name">接警数</div>
            <div class="num-value">{{commonStatistic.alarmAmount}}</div>
          </div>
          <div class="num">
            <div class="num-name">派车数</div>
            <div class="num-value">{{commonStatistic.sendAmount}}</div>
          </div>
          <div class="num">
            <div class="num-name">已完成</div>
            <div class="num-value">{{commonStatistic.finishedAmount}}</div>
          </div>
        </div>
        <div class="left-bar">
          <div class="left-bar1-box">
            <!-- 左侧柱状图1 -->
            <Chart id="bar1" width="100%" height="370px" :option="bar1opt" />
          </div>
          <hr>
          <div class="left-bar2-box">
            <!-- 左侧柱状图2 -->
            <Chart id="bar2" width="500px" height="370px" :option="bar2opt" />
            <div class="left-bar2-list">
              <ul>
                <li v-for="(item,i) in sendCarDay">
                  <i class="circle" :style="{backgroundColor:colorList[i]}"></i><span class='station-name'>{{item.org_name}}</span>：-----<span class="station-value">{{item.amount}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="t-mid">
        <div class='time'>{{timeStr}}</div>
        <!-- 地图 -->
        <Chart id="YCmap" width="100%" height="700px" :geojson="geoJSON" registerMap="YC" :option="mapopt" />
        <div class="area-count">
          <div v-for="item in commonStatistic.distribution" class="area-count-item">
            <span class="area-count-item-name">{{item.region_name}}：</span>
            <span class="area-count-item-value">{{item.amount}}</span>
          </div>
        </div>
      </div>
      <!-- 右侧表格及柱状图 -->
      <div class="t-right">
        <div class="t-right-form">
          <div class="onduty">
            <div class="tab-title">>>当日任务车辆<<</div> <div class="tab-head">
                <div class="tab-head-item">车辆状态</div>
                <div class="tab-head-item">车辆名称</div>
                <div class="tab-head-item">分站</div>
            </div>
            <div class="tab-main">
              <div v-if="item.isExecute===1" v-for="item in ambTask" class="tab-line">
                <div class="tab-line-status" v-if="item.status===0"><span class="bg-blue">任务开始</span></div>
                <div class="tab-line-status" v-else-if="item.status===1"><span class="bg-yellow">收到指令</span></div>
                <div class="tab-line-status" v-else-if="item.status===2"><span class="bg-cyan-blue">驶向现场</span></div>
                <div class="tab-line-status" v-else-if="item.status===3"><span class="bg-orange">到达现场</span></div>
                <div class="tab-line-status" v-else-if="item.status===4"><span class="bg-pink">病人上车</span></div>
                <div class="tab-line-status" v-else-if="item.status===5"><span class="bg-purple">到达医院</span></div>
                <div class="tab-line-name">{{item.serialNumber}}</div>
                <div class="tab-line-station">{{item.stationId}}</div>
              </div>
            </div>
          </div>
          <hr>
          <div class="waiting">
            <div class="tab-title">>>当日待命车辆<<</div> <div class="tab-head">
                <div class="tab-head-item">车辆状态</div>
                <div class="tab-head-item">车辆名称</div>
                <div class="tab-head-item">分站</div>
            </div>
            <div class="tab-main">
              <div v-if="item.isExecute===0" v-for="item in ambTask" class="tab-line">
                <div class="tab-line-status" v-if="item.status===6"><span class="bg-lightblue">途中待命</span></div>
                <div class="tab-line-status" v-else-if="item.status===7"><span class="bg-green">站内待命</span></div>
                <div class="tab-line-name">川A56789</div>
                <div class="tab-line-station">宜春中心医院分站</div>
              </div>
            </div>
          </div>
        </div>
        <div class="t-right-bar">
          <!-- 右侧柱状图 -->
          <Chart id="bar3" width="100%" height="100%" :option="bar3opt" />
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="b-left">
        <!-- 底部折线图 -->
        <Chart id="line" width="100%" height="100%" :option="lineopt" />
      </div>
      <div class="b-right">
        <!-- 底部右侧饼图 -->
        <Chart id="pie" width="100%" height="100%" :option="pieopt" />
      </div>
    </div>
  </div>
</template>

<script>
// import Chart from './components/bar'
import Chart from '@com/bar'
import ycGeoJSON from './assets/geoJSON/yichun'
export default {
  name: 'app',
  data() {
    return {
      //  时间
      timeStr: '',
      //  统计数量
      commonStatistic: {},
      //  当月分站平均出车时间
      caroutTimeMonth: {},
      //  当日分站出车量
      sendCarDay: {},
      //  车辆状态
      ambTask: [],
      //  地图数据
      eventMap: [],
      //  全局颜色列表
      colorList: [
        '#C33531',
        '#EFE42A',
        '#64BD3D',
        '#EE9201',
        '#29AAE3',
        '#B74AE5',
        '#0AAF9F',
        '#E89589',
        '#16A085',
        '#4A235A',
        '#C39BD3',
        '#F9E79F',
        '#BA4A00',
        '#ECF0F1',
        '#616A6B',
        '#EAF2F8',
        '#4A235A',
        '#3498DB'
      ],
      //  当月分站平均出车时间
      bar1opt: {
        title: {
          text: '>>当月分站平均出车时间<<',
          textStyle: {
            color: '#59acff',
            fontSize: 20
          },
          left: 'center', //  标题居中
          top: 20
        },
        tooltip: {
          show: true
        },
        grid: {
          top: 80 //  图表距离容器的位置
        },
        xAxis: {
          data: [],
          axisLabel: {
            textStyle: {
              color: '#59acff'
              // fontSize: 12
            },
            rotate: -15,
            interval: 0 //  强制显示所有刻度标签
          },
          axisLine: {
            lineStyle: {
              color: '#59acff' //  轴线颜色
            }
          },
          axisTick: {
            alignWithLabel: true, //  刻度对齐柱状图
            inside: true //  刻度向内
          }
        },
        yAxis: {
          name: '时间：分钟',
          nameTextStyle: {
            fontSize: 20
          },
          axisLabel: {
            textStyle: {
              color: '#59acff',
              fontSize: 20
            }
          },
          splitLine: {
            show: false //  隐藏轴向分隔线
          },
          axisLine: {
            lineStyle: {
              color: '#59acff'
            }
          },
          axisTick: {
            inside: true
          }
        },
        series: [
          {
            name: '时间',
            type: 'bar',
            barWidth: 30,
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  color: '#59acff'
                },
                color: new this.$E.graphic.LinearGradient(0, 0, 0, 1, [
                  //  柱状图渐变
                  { offset: 0, color: '#e10019' },
                  { offset: 1, color: '#3399ff' }
                ])
              }
            }
          }
        ]
      },
      //  当日分站出车量
      bar2opt: {
        title: {
          text: '>>当日分站出车量<<',
          textStyle: {
            color: '#59acff',
            fontSize: 20
          },
          left: 'center', //  标题居中
          top: 20
        },
        grid: {
          top: 80,
          bottom: 10
        },
        tooltip: {
          show: true
        },
        xAxis: {
          data: [],
          axisLabel: {
            show: false,
            textStyle: {
              color: '#59acff',
              fontSize: 20
            },
            interval: 0
          },
          axisLine: {
            lineStyle: {
              color: '#59acff' //  轴线颜色
            }
          },
          axisTick: {
            alignWithLabel: true, //  刻度对齐柱状图
            inside: true //  刻度向内
          }
        },
        yAxis: {
          nameTextStyle: {
            fontSize: 20
          },
          axisLabel: {
            textStyle: {
              color: '#59acff',
              fontSize: 20
            }
          },
          splitLine: {
            show: false //  隐藏轴向分隔线
          },
          axisLine: {
            lineStyle: {
              color: '#59acff'
            }
          },
          axisTick: {
            inside: true
          }
        },
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: 30,
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                },
                color: params => {
                  return this.colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      },
      //  当月调度员平均受理时间
      bar3opt: {
        title: {
          text: '>>当月调度员平均受理时间<<',
          textStyle: {
            color: '#59acff',
            fontSize: 20
          },
          left: 'center', //  标题居中
          top: 20
        },
        grid: {
          left: 80,
          right: 30,
          bottom: 30
        },
        tooltip: {
          show: true
        },
        xAxis: {
          data: [],
          axisLabel: {
            textStyle: {
              color: '#59acff'
            },
            interval: 0
          },
          axisLine: {
            lineStyle: {
              color: '#59acff' //  轴线颜色
            }
          },
          axisTick: {
            alignWithLabel: true, //  刻度对齐柱状图
            inside: true //  刻度向内
          }
        },
        yAxis: {
          name: '时间：秒',
          nameTextStyle: {
            fontSize: 20
          },
          axisLabel: {
            textStyle: {
              color: '#59acff',
              fontSize: 20
            }
          },
          splitLine: {
            show: false //  隐藏轴向分隔线
          },
          axisLine: {
            lineStyle: {
              color: '#59acff'
            }
          },
          axisTick: {
            inside: true
          }
        },
        series: [
          {
            name: '时间',
            type: 'bar',
            barWidth: 30,
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  color: '#59acff'
                },
                color: new this.$E.graphic.LinearGradient(0, 0, 0, 1, [
                  //  柱状图渐变
                  { offset: 0, color: '#e10019' },
                  { offset: 1, color: '#3399ff' }
                ])
              }
            }
          }
        ]
      },
      //  24小时呼入量
      lineopt: {
        title: {
          text: '>>24小时呼入量<<',
          textStyle: {
            color: '#59acff',
            fontSize: 20
          },
          left: 'center', //  标题居中
          top: 20
        },
        grid: {
          left: 100,
          right: 100,
          bottom: 50
        },
        xAxis: {
          type: 'category',
          //boundaryGap: false,   //  坐标轴两侧留白
          axisTick: {
            alignWithLabel: true, //  刻度对齐柱状图
            inside: true //  刻度向内
          },
          data: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23
          ],
          axisLabel: {
            textStyle: {
              color: '#59acff',
              fontSize: 20
            }
          },
          axisLine: {
            lineStyle: {
              color: '#59acff' //  轴线颜色
            }
          }
        },
        yAxis: {
          //name:'呼入量：次',
          type: 'value',
          splitLine: {
            show: false //  隐藏轴向分隔线
          },
          axisTick: {
            alignWithLabel: true, //  刻度对齐柱状图
            inside: true //  刻度向内
          },
          axisLabel: {
            textStyle: {
              color: '#59acff',
              fontSize: 20
            }
          },
          axisLine: {
            lineStyle: {
              color: '#59acff' //  轴线颜色
            }
          }
        },
        series: [
          {
            data: [],
            type: 'line',
            label: {
              show: true
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(236, 64, 118, 0.8)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(94, 38, 227, 0.5)' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            }
          }
        ]
      },
      //  任务类型
      pieopt: {
        title: {
          text: '>>任务类型<<',
          textStyle: {
            color: '#59acff',
            fontSize: 20
          },
          left: 'center',
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '任务类型',
            type: 'pie',
            radius: '65%',
            center: ['50%', '55%'], //  饼图位置
            selectedMode: 'single',
            label: {
              normal: {
                formatter: '{b| {b}：}{c}  {per|{d}%}  ',
                backgroundColor: 'transparent',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            labelLine: {
              length: 10,
              length2: 40
            },
            data: [],
            itemStyle: {
              color: params => {
                return this.colorList[params.dataIndex]
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      //  地图 geoJSON
      geoJSON: ycGeoJSON,
      //  地图 option
      mapopt: {
        title: {
          text: '>>今日事件各区分布<<',
          left: 'center',
          bottom: 20,
          textStyle: {
            color: '#59acff'
          }
        },
        geo: {
          //  series 中的 scatter 与这里相呼应，不是 series 中的 type=map
          map: 'YC', //  与组件中 registerMap 参数对应
          zoom: 1, //  缩放
          roam: false, //  拖拽+滚轮缩放
          aspectScale: 1, //  地图长宽比
          label: {
            //  标签相关样式
            show: true,
            color: '#59acff',
            fontSize: 20
          },
          emphasis: {
            //  鼠标悬停时标签相关样式
            label: {
              show: false,
              color: 'yellow'
            }
          },
          itemStyle: {
            //  区域样式
            normal: {
              areaColor: 'transparent',
              borderColor: '#59acff',
              borderWidth: 2
            },
            emphasis: {
              areaColor: ''
            }
          }
        },
        series: [
          {
            //  这种点可以标在 option.geo 生成的地图上，而不是 option.series 下的 type = map 上
            name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: 5,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#ddb926'
              }
            }
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [
              {
                name: 'series.data.name',
                value: [115.569858, 28.73115, 200]
              },
              {
                name: 'series.data.name',
                value: [114.569858, 28.13115, 200]
              }
            ],
            symbolSize: function(val) {
              return val[2] / 10
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#f4e925',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            zlevel: 1
          }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    console.log(process.env);
    setInterval(() => {
      let date = new Date()
      this.timeStr = this.formatDate(date, 'YYYY年MM月DD日 hh:mm:ss 星期')
    }, 1000)
    //  登录
    this.$A
      .post('/login', {
        userName: '李河谕坐席',
        password: '123456'
      })
      .then(res => {
        if (res.data.success !== true) {
          alert('登录失败')
        }
      })

    //  统计数量（话务/接警/派车/完成）
    this.$A.get('/screen/queryCommonStatistics').then(res => {
      if (res.data.success === true) {
        this.commonStatistic = res.data.data
      }
    })

    //  当月分站平均出车时间（柱状图）
    this.$A.get('/screen/avgCaroutTimeMonth').then(res => {
      if (res.data.success === true) {
        this.caroutTimeMonth = res.data.data
        this.bar1opt.xAxis.data = this.caroutTimeMonth.map(item => {
          return item.org_name
        })
        this.bar1opt.series[0].data = this.caroutTimeMonth.map(item => {
          return parseInt(item.avg_carout_time / 60)
        })
      }
    })

    //  当日分站出车量（柱状图）
    this.$A.get('/screen/quantitySendCarDay').then(res => {
      if (res.data.success === true) {
        this.sendCarDay = res.data.data
        this.bar2opt.xAxis.data = this.sendCarDay.map(item => {
          return item.org_name
        })
        this.bar2opt.series[0].data = this.sendCarDay.map(item => {
          return item.amount
        })
      }
    })

    //  当月调度员平均受理时间（柱状图）
    this.$A.get('/screen/avgAcceptTimeMonth').then(res => {
      if (res.data.success === true) {
        let arr = res.data.data
        this.bar3opt.xAxis.data = arr.map(item => {
          return item.staff_name
        })
        this.bar3opt.series[0].data = arr.map(item => {
          return parseInt(item.avg_accept_time)
        })
      }
    })

    //  24小时呼入量（折线图）
    this.$A.get('/screen/quantityCallinHour').then(res => {
      if (res.data.success === true) {
        //  后台只会返回有呼入量的小时和对应呼入量，因此需要生成一个 24 位都是 0 的数组
        let arr = res.data.data
        let init0Arr = []
        for (let n = 0; n < 24; n++) init0Arr[n] = 0

        //  将数组中对应的小时从 0 改为实际值
        for (let i = 0; i < arr.length; i++) {
          init0Arr[arr[i].hour] = arr[i].amount
        }
        this.lineopt.series[0].data = init0Arr
      }
    })

    //  车辆状态（表格区）
    this.$A.get('/screen/queryAmbTask').then(res => {
      if (res.data.success === true) {
        this.ambTask = res.data.data
      }
    })

    //  任务类型（饼图）
    this.$A.get('/screen/queryEventType').then(res => {
      if (res.data.success === true) {
        let data = res.data.data.map(o => {
          return { value: o.amount, name: o.name }
        })
        this.pieopt.series[0].data = data
      }
    })

    //  事件坐标查询（地图）
    this.$A.get('/screen/queryEventMap').then(res => {
      if (res.data.success === true) {
        this.eventMap = res.data.data

        this.mapopt.series[0].data = this.eventMap.map(item => {
          let n = this.rd(-1, 1) //  模拟坐标
          let k = this.rd(-1, 1) //  模拟坐标
          return {
            name: item.eventName,
            // value: [item.senceAddrYcoordinate, item.senceAddrXcoordinate, 10]
            value: [114.412251 + n, 27.804604 + k] //  模拟坐标
          }
        })
      }
    })
  },
  methods: {
    //  时间格式化
    formatDate(date, format) {
      if (arguments.length < 2 && !date.getTime) {
        format = date
        date = new Date()
      }
      typeof format != 'string' && (format = 'YYYY年MM月DD日 hh时mm分ss秒')
      var week = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        '日',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六'
      ]
      return format.replace(
        /YYYY|YY|MM|DD|hh|mm|ss|星期|周|www|week/g,
        function(a) {
          switch (a) {
            case 'YYYY':
              return date.getFullYear()
            case 'YY':
              return (date.getFullYear() + '').slice(2)
            case 'MM':
              return date.getMonth() + 1
            case 'DD':
              return date.getDate()
            case 'hh':
              return date.getHours() < 10
                ? '0' + date.getHours()
                : date.getHours()
            case 'mm':
              return date.getMinutes() < 10
                ? '0' + date.getMinutes()
                : date.getMinutes()
            case 'ss':
              return date.getSeconds() < 10
                ? '0' + date.getSeconds()
                : date.getSeconds()
            case '星期':
              return '星期' + week[date.getDay() + 7]
            case '周':
              return '周' + week[date.getDay() + 7]
            case 'week':
              return week[date.getDay()]
            case 'www':
              return week[date.getDay()].slice(0, 3)
          }
        }
      )
    },
    //  随机数
    rd(min, max) {
      let c = max - min + 1
      return Math.random() * c + min
    }
  },
  components: {
    Chart
  }
}
</script>

<style>
@import './assets/css/common';
html,
body {
  margin: 0;
  padding: 0;
  width: 2560px;
  height: 1440px;
  background: url('./assets/images/bg.png') no-repeat;
}

hr {
  border-color: #113270;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  overflow: hidden;
}
.top,
.bottom {
  display: flex;
}
.top {
  margin: 20px 18px 0 26px;
  height: 1038px;
}
.t-left {
  width: 742px;
}
.numboxs {
  height: 264px;
}
.num {
  width: 360px;
  height: 124px;
  float: left;
  box-sizing: border-box;
  padding: 14px 30px;
}
.num:nth-child(1) {
  margin-right: 19px;
  margin-bottom: 18px;
}
.num:nth-child(3) {
  margin-right: 19px;
  margin-bottom: 18px;
}
.num .num-name {
  color: #59acff;
}
.num .num-value {
  text-align: center;
  font-size: 50px;
}
.left-bar {
  height: 750px;
  margin-top: 20px;
}
.left-bar2-box {
  display: flex;
  list-style: none;
}
.left-bar2-list ul {
  list-style: none;
  color: #59acff;
  padding: 0;
  width: 200px;
  height: 340px;
  overflow: auto;
  white-space: nowrap;
}
.left-bar2-list ul::-webkit-scrollbar {
  /* display: none; */
}
.left-bar2-list ul li {
  height: 30px;
  line-height: 30px;
}

.station-value {
  color: #fff;
  font-size: 20px;
  padding: 10px;
}

.circle {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 10px;
  border-radius: 50%;
}
.t-mid {
  width: 988px;
  margin: 0 20px;
}
.time {
  background-color: #041345;
  display: inline-block;
  padding: 5px 10px;
  margin-left: 50%;
  transform: translate(-50%, 100px);
  text-align: center;
  color: #59acff;
}
#YCmap {
  margin-top: 130px;
}
.area-count {
  overflow-y: auto;
  margin-top: 10px;
  max-height: 120px;
}
.area-count-item {
  width: 20%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  float: left;
}
.area-count-item-name {
  color: #59acff;
}
.area-count-item-value {
  font-weight: bold;
}
.t-right {
  width: 746px;
}
.t-right-form {
  height: 745px;
  padding: 0 20px;
  color: #59acff;
}

.tab-title {
  color: #59acff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 10px 0;
}
.tab-head {
  overflow: hidden;
  font-size: 18px;
  background-color: #041345;
  padding: 10px 0;
}
.tab-head-item {
  width: 33.333333%;
  float: left;
  padding-left: 20px;
  box-sizing: border-box;
}
.tab-main {
  height: 280px;
  overflow-y: auto;
}
.tab-main::-webkit-scrollbar {
  display: none;
}
.tab-line {
  overflow: hidden;
  height: 56px;
  line-height: 56px;
}
.tab-line > div {
  width: 33.333333%;
  float: left;
  padding-left: 20px;
  box-sizing: border-box;
}
.tab-line-status span {
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
}

.t-right-bar {
  margin-top: 20px;
  height: 268px;
}

.bottom {
  margin: 20px 18px 0 26px;
  height: 334px;
}
.b-left {
  width: 1750px;
  height: 332px;
}
.b-right {
  margin-left: 20px;
  width: 742px;
  height: 332px;
}
</style>
