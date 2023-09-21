export class CustomMapControl {
  constructor(opt: any) {
    const ctrl: any = this
    ctrl.id = opt.id
    ctrl.class = opt.class
  }

  onAdd(map: any) {
    const ctrl: any = this
    ctrl._map = map
    ctrl._container = document.createElement('div')
    ctrl._container.className = `mapboxgl-ctrl-group mapboxgl-ctrl ${ctrl.class}`
    ctrl.id.forEach((id: any) => {
      const domNode = document.getElementById(id)
      if (domNode) {
        ctrl._container.appendChild(document.getElementById(id))
      }
    })
    return ctrl._container
  }
}
