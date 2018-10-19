<template>
  <div :id="id" :style="style"></div>
</template>
<script>
export default {
  name: 'Chart',
  data() {
    return {
      //  echarts实例
      chart: ''
    }
  },
  props: {
    //  父组件需要传递的参数：id，width，height，option
    //  当使用 geoJSON 生成地图时，需要传递 geoJSON 和用于 registerMap 的地图名
    id: {
      type: String
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    geojson: {
      type: Object,
      default: null
    },
    registerMap: {
      type: String,
      default: ''
    },
    option: {
      type: Object,      
      default() {
        return {
          title: {
            text: 'vue-Echarts'
          },
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '销量',
              type: 'line',
              data: [5, 20, 36, 10, 10, 70]
            }
          ]
        }
      }
    }
  },
  watch: {
    //  深度监听
    option: {
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.chart.setOption(newVal)
          } else {
            this.chart.setOption(oldVal)
          }
        } else {
          this.init()
        }
      },
      deep: true
    }
  },
  computed: {
    style() {
      return {
        height: this.height,
        width: this.width
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.chart = this.$E.init(document.getElementById(this.id))
      if (this.geojson != null) {
        this.$E.registerMap(this.registerMap, this.geojson)
      }
      this.chart.setOption(this.option)
    }
  }
}
</script>
