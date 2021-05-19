(function () {
  'use strict';

  angular
  .module('app')
  .controller('VerificarController', VerificarController);


  function VerificarController(Message, backUrl, DataService, $log, Documento, Util, $location) {
    
    activate();
    var vm = this;
    vm.currentNavItem= 'verificar';
    vm.goto= function(page) {
      vm.status = 'Go to '+page;
    };

    vm.data = {
      selectedIndex: 0
    };

    vm.next = function () {
      vm.data.selectedIndex = Math.min(vm.data.selectedIndex +1, 2);
    };
    vm.previous = function () {
      vm.data.selectedIndex = Math.max(vm.data.selectedIndex -1, 0);
    };


    vm.esMovil = Documento.isMobile();
    
    
    vm.buscar = buscar;
    vm.irInicio = irInicio;

    function activate() {
      angular.element('body').addClass('no-login');
      angular.element('body').removeClass('principal');
    }
    
    function buscar() {
      if(vm.datosDocumento) {
        vm.datosDocumento = {};
        vm.pdf = null;
        vm.pdf_buffer = null;
      }
      vm.datos.codigo = vm.datos.codigo.toUpperCase();
      DataService.post(backUrl + 'verificar', vm.datos)
      .then(function (respPost) {
        if(respPost && respPost.tipoMensaje !== 'ERROR') {
          vm.datosDocumento = respPost.datos;
          vm.datos.token = respPost.datos.token;
        }
        if(respPost ) {
          DataService.pdf(backUrl + 'pdfVerificado', vm.datos)
          .then(function (response) {
            if(response) {
              vm.pdf = response.url;
              vm.pdf_buffer = response.data;
              if (vm.esMovil) {
                Util.loadCanvas(response.data, '#canvasContainerVerificado');
              }
            }
          })
        }
      })
      .catch(function (error) {
        Message.error(error);
      })
    }

    function irInicio() {
      $location.path('login');
    }
  }
})();
