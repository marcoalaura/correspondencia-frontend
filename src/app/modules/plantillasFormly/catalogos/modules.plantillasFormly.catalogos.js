
(function () {
  'use strict';

  angular
  .module('app')
  .controller('CatalogosController', CatalogosController);

  /**@ngInject */

  function CatalogosController(DataService, restUrl, Storage, Modal, $location ) {
    var vm = this;
    var cuenta = Storage.getUser();
    vm.cuenta = cuenta;
    vm.usuario = cuenta.id;
    vm.titulo = "Edición/Creación de Catalogos";

    vm.url = restUrl + 'plantillasFormly/catalogo/'+vm.usuario+'/miscatalogos';
    vm.fields = ['id_catalogo', 'nombre', 'descripcion', 'estado'];
    vm.permissions = {
      create: false,
      update: false,
      delete: true
    };

    vm.order = 'estado';

    vm.botonAgregar = {
      tooltip: 'crear',
      icon: 'add',
      onclick: irCatalogo
    }
    vm.botones = [
      {
        tooltip: 'Agregar documentos/usuarios',
        icon: 'share',
        onclick: irCatalogo
      }
    ];

    function irCatalogo(ev, id) {
      ev.preventDefault();
      var identificador = 0;
      if (id) identificador = id;
      $location.path('catalogo/'+identificador);
    }
  }
})();