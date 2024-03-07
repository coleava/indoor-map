import React, { useEffect, useState } from 'react'
import { geoJSON } from './stadium'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Divider } from 'antd'
import './indoor.css'

let lng = 121.597368,
  lat = 31.237085
const L = window.L
const LeafletMap = () => {
  const [visible, setVisible] = useState(false)
  const [info, setInfo] = useState(true)
  const [level, setLevel] = useState(1)
  useEffect(() => {
    // 创建地图对象
    const mapContainer = document.getElementById('map')

    if (mapContainer && !mapContainer.hasChildNodes()) {
      let test = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
        maxZoom: 18,
        minZoom: 5,
      })
      // let baseLayers = { test }
      let map = L.map('map', {
        center: [lat, lng],
        zoom: 18,
        layers: [test],
        zoomControl: false,
      })

      L.control
        .zoom({
          zoomInTitle: '放大',
          zoomOutTitle: '缩小',
        })
        .addTo(map)

      let indoor = new L.Indoor(coordinateCovert(geoJSON), {
        minCaptionZoom: 18,
        onEachFeature: roomCallBacks,
        style: (feature) => {
          let style = {
            weight: 1,
          }
          if (feature.properties.type === 'room') {
            return {
              fillColor: 'red',
              color: 'red',
              ...style,
            }
          } else if (feature.properties.type === 'floor') {
            return {
              fillColor: '#f6c468',
              color: '#f6c468',
              ...style,
            }
          } else {
            return {
              fillColor: 'blue',
              color: 'blue',
              dashArray: 3,
              ...style,
            }
          }
        },
      })

      indoor.addTo(map)
      let circle = generateCircle(map)

      let levelControl = new L.Control.Level({
        level,
        levels: indoor.getLevels(),
        indoorLayer: indoor,
        reset: () => {
          if (indoor.getLevel() !== 1) {
            if (map.hasLayer(circle)) {
              map.removeLayer(circle)
            }
          } else {
            if (map.hasLayer(circle)) {
              map.removeLayer(circle)
            } else {
              circle = generateCircle(map)
              map.addLayer(circle)
            }
          }
          changeVisible(false)
        },
      })
      levelControl.addTo(map)
    }
  }, [])

  const roomCallBacks = (feature, layer) => {
    layer.on('mouseover', () => {
      layer.setStyle({ fillColor: '#02d35f' })
    })
    layer.on('mouseout', () => {
      layer.setStyle({ fillColor: '#c0c0c0' })
    })
    layer.on('click', () => {
      let { properties } = feature

      if (properties.type === 'room') {
        setInfo({ ...properties })
        changeVisible(true)
      }
    })
  }

  const generateCircle = (map) => {
    let latLng = window.wgs84togcj02({ lng: 121.59329241453327, lat: 31.23897218858271 })

    let circle = L.circle([latLng.lat, latLng.lng], {
      color: 'red', // 圆圈的边框颜色
      fillColor: 'red', // 圆圈的填充颜色
      fillOpacity: 0.5, // 圆圈的填充透明度
      radius: 2, // 圆圈的半径（单位：米）
    })
    circle.on('click', (e) => {
      // 生成随机颜色
      // var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)

      // 设置圆形的新颜色
      if (circle.options.color === 'red') {
        circle.setStyle({
          color: '#58c65b', // 设置边框颜色为随机颜色
          fillColor: '#58c65b', // 设置填充颜色为随机颜色
        })
      } else {
        circle.setStyle({
          color: 'red', // 设置边框颜色为随机颜色
          fillColor: 'red', // 设置填充颜色为随机颜色
        })
      }
    })
    circle.addTo(map)
    return circle
  }

  const coordinateCovert = (geojson) => {
    geojson.features = geojson.features.map((feature) => {
      feature.geometry.coordinates = feature.geometry.coordinates.map((coors) => {
        coors = coors.map((x) => {
          let res = window.wgs84togcj02({ lng: x[0], lat: x[1] })

          return [res.lng, res.lat]
        })

        return coors
      })

      return feature
    })

    return geojson
  }

  const changeVisible = (visible) => {
    setVisible(visible)
  }

  return (
    <div>
      <div id="map" style={{ height: '100vh' }} />
      {visible && (
        <div style={{ position: 'absolute', right: 16, top: 32, background: '#fff', width: 320, height: 365, zIndex: 99999 }}>
          <div style={{ height: 40, backgroundColor: '#d84d33', color: '#fff', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
            <span>A3-104</span>
            <CloseOutlined onClick={() => changeVisible(false)} />
          </div>
          <div style={{ marginTop: 40 }}>
            <div style={{ height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', color: 'grey' }}>
              <div>课程周期</div>
              <div>{info.value1}</div>
            </div>
            <Divider />
            <div style={{ height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', color: 'grey' }}>
              <div>部门</div>
              <div>{info.value2}</div>
            </div>
            <Divider />
            <div style={{ height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', color: 'grey' }}>
              <div>助教姓名</div>
              <div>{info.value3}</div>
            </div>
            <Divider />
            <div style={{ height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', color: 'grey' }}>
              <div>支持人员</div>
              <div>{info.value4}</div>
            </div>
            <Divider />
            <div style={{ height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', color: 'grey' }}>
              <div>学员人数</div>
              <div>{info.value5}</div>
            </div>
            <Divider />
          </div>
          {info.hasVideo && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 12 }}>
              <Button>现场画面</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LeafletMap
