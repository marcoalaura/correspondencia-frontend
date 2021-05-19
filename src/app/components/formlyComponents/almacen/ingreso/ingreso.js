(function () {
  'use strict';

  angular
    .module('app')
    .controller('fcIngresoAlmacenController', IngresoAlmacen);

  /** @ngInject */
  function IngresoAlmacen($scope, $timeout, DataService, restUrl) {
    var vm = this;
    var sc = $scope;
    var model, articulos;

    sc.vm = vm;
    vm.buscarProveedor = buscarProveedor;
    vm.buscarArticulo = buscarArticulo;
    vm.agregarFila = agregarFila;
    vm.eliminarFila = eliminarFila;
    vm.calcularSubTotal = calcularSubTotal;
    vm.calcularTotal = calcularTotal;
    vm.calcularTotalConDescuento = calcularTotalConDescuento;
    vm.proveedores = [];
    $timeout(iniciarController);
  

    function iniciarController() {
      if (angular.isUndefined(sc.model[sc.options.key])) {
        sc.model[sc.options.key] = {
          reingreso: false,
          proveedor: {},
          proveedor_nombre: '',
          c31: null,
          c31_fecha: null,
          nota_entrega_numero: null,
          nota_entrega_fecha: null,
          factura_numero: null,
          factura_autorizacion: null,
          factura_fecha: null,
          items: [],
          descuento: 0,
          subtotal: 0.00,
          total: 0.00
        };
      }
      if(vm.proveedores.length === 0) {
        if (angular.isDefined(sc.model[sc.options.key].proveedor.nombre)) {
          vm.proveedores.push(sc.model[sc.options.key].proveedor);
        }
        vm.proveedor_buscar = sc.model[sc.options.key].proveedor.nombre;
      }
      articulos = sc.model[sc.options.key].items;
      model = sc.model[sc.options.key];
    }

    function buscarProveedor() {
      if (!vm.proveedor_buscar) return;
      var url = restUrl + 'almacen/proveedor/?filter='+vm.proveedor_buscar;
      return DataService.get(url)
      .then(function (resp) {
        vm.proveedores = resp.datos;
      })
    }
    function buscarArticulo() {
      var url = restUrl + 'almacen/consulta/?filter='+vm.articulo_buscar+'&todos=1';
      return DataService.get(url)
      .then(function (resp) {
        vm.articulos = resp.datos || [];
        
      })
    }

    function agregarFila(indice) {
      var itemTemp = angular.copy(vm.articulos[indice]);
      if (itemTemp) {
        itemTemp.cantidad = 0;
        itemTemp.precio = '0.00';
        itemTemp.total = '0.00';
        if (!seRepite(itemTemp.codigo)) articulos.push(itemTemp);
        vm.articulos.splice(indice, 1);
      }
    }

    function eliminarFila(indice) {
      articulos.splice(indice, 1);
      vm.calcularTotal();
    }

    function seRepite(codigo) {
      var resp = false;
      articulos.forEach(function (item) {
        if (item.codigo === codigo) {
          resp = true;
        }
      });
      return resp;
    }

    function calcularSubTotal(indice) {
      var precio = articulos[indice].precio;
      var cantidad = articulos[indice].cantidad;
      var total = parseInt(cantidad) *  parseFloat(precio);
      articulos[indice].total = total.toFixed(2);
      vm.calcularTotal();
    }

    function calcularTotal() {
      var descuento = model.descuento || 0;
      var total = 0;
      for (var i = 0; i < articulos.length; i++) {
        var element = articulos[i];
        total += parseFloat(element.total);
      }
      model.subtotal = total.toFixed(2);
      // if (descuento) 
      total = total - parseFloat(descuento);
      model.total = total.toFixed(2);
    }

    function calcularTotalConDescuento() {
      var descuento = model.descuento || 0;
      var total = model.total || 0;
      var totalConDescuento = parseFloat(total) - parseFloat(descuento);
      model.total = totalConDescuento.toFixed(2);
    }
  }
})();