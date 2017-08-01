;(function () {
  /*********example************/

  //action-type
  var TYPE = {
    ADDADDR: 'addAddress',
    ADDADDRSUC: 'addAddressSuc',
    ADDADDRFAIL: 'addAddressFail',
  };

  //actions
  var addAddress = createAction(TYPE.ADDADDR);
  var addAddressSuc = createAction(TYPE.ADDADDRSUC);
  var addAddressFail = createAction(TYPE.ADDADDRFAIL);

  var actionAddAddress = function (address) {
    addAddress();

    if (address != void 0) {
      addAddressSuc(address);
    }

    else {
      addAddressFail();
    }
  };

  //reducer
  var addressReducer = createReducer({}, function (initState, payload) {
    var type = payload.type,
      data = payload.data
      ;

    switch (type) {
      case TYPE.ADDADDR:
        break;
      case TYPE.ADDADDRSUC:
        break;
      case TYPE.ADDADDRFAIL:
        break;
      default :
        return initState;
    };
  });

  var mobileReducer = createReducer({}, function (initState, payload) {
    var type = payload.type,
      data = payload.data
      ;

    switch (type) {
      case 1 :
        break;
      default :
        return initState;
    };
  });

  var menuReducer = createReducer({}, function (initState, payload) {
    var type = payload.type,
      data = payload.data
      ;

    switch (type) {
      case 1 :
        break;
      default :
        return initState;
    };
  });

  //store
  var store = createStore({
    address: addressReducer,
    mobile: mobileReducer,
    menu: menuReducer,
  });

  //selector
  function addressSelector = function (store) {
    return store.address;
  };

  function mobileSelector = function (store) {
    return store.mobile;
  };

  function menuSelector = function (store) {
    return store.menu;
  };

  var headerReselector = createSelector(addressSelector, mobileSelector, function (address, mobile) {
    return {
      addressName: address.addressName,
      mobileNo: mobile.mobileNo,
    };
  });

  //component
  var headerComponent = Component(headerReselector, {
    addAddress: function addAddress (address) {
      actionAddAddress(address);
    },

    render: function render () {
      console.log(this.props);
    },
  });
} ())