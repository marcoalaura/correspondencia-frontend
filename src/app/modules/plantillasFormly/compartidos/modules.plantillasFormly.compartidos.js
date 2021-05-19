(function (){
  'use strict';

  angular
  .module('app')
  .controller('CompartidosController', CompartidosController);

  /**@ngInject */

  function CompartidosController(restUrl, Storage, $location) {
    var vm = this;
    var cuenta = Storage.getUser();
    vm.cuenta = cuenta;
    vm.usuario = cuenta.id;
    vm.titulo = 'Catalogos compartidos';

    vm.url = restUrl + 'plantillasFormly/catalogo/'+vm.usuario+'/compartidos';
    vm.fields = ['id_catalogo', 'nombre', 'descripcion', 'estado'];
    vm.permissions = {
      create: false,
      update: false,
      delete: false
    };

    vm.order = 'nombre'
    vm.botones = [
      { tooltip: 'Ir catalogo', icon:'folder_shared', onclick: irCatalogo }
    ]


    function irCatalogo(ev, id) {
      ev.preventDefault();
      var identificador = 0;
      if (id) identificador = id;
      $location.path('compartido/' + identificador);
    }
  }
})();