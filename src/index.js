import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 


class Store extends React.Component {

  renderCoupons(coupon) {
   
  return  <Coupon 
              key           = { coupon.id } //warnings
              id            = { coupon.id }
              name   	      = { coupon.name } 
              product 	    = { coupon.product }
              price		      = { coupon.price }
              date		      = { coupon.end_date }
              onClick       = { (obj) => this.addToCart(obj) }
              isInCart      = { coupon.isInCart }
            />;
  }

  constructor(props) {
      super(props);
      //const items   = [{id: Number(1),name: 'Autumn Promo',product: 'Chrysanthemums', price: Number(21.00),end_date: '2019-08-10'}, {id: Number(2),name: 'Sale of the century',product: 'Lilacs',price: Number(10.00),end_date: '2019-07-01'}, {id: Number(3),name: '24 Hour Sale',product: 'Roses',price: Number(19.00),end_date: '2019-05-09'}]; 
      const coupons = [{id: Number(1),name: 'Autumn Promo',product: 'Chrysanthemums', price: Number(21.00),end_date: '2019-08-10', isInCart:false}, {id: Number(2),name: 'Sale of the century',product: 'Lilacs',price: Number(10.00),end_date: '2019-07-01',isInCart:false}, {id: Number(3),name: '24 Hour Sale',product: 'Roses',price: Number(19.00),end_date:'2019-05-09',isInCart:false}]; 
      this.state    = {
         quantItems:0,
         total:0,
         coupons:coupons,
         items:null,
      };
  }

  addToCart(obj){

    if(this.state.items != null && !this.isInCart(obj.id)){
      this.setState({total: this.state.total + Number(obj.price)});
      this.setState({quantItems:  this.state.quantItems + 1});
      const itemsAux = this.state.items.slice();
      itemsAux.unshift(obj);
      this.setState({items:itemsAux});
    }else if(this.state.items == null){
      this.setState({total: Number(obj.price)});
      this.setState({quantItems:1});
      const itemsAux = [];
      itemsAux.unshift(obj);
      this.setState({items:itemsAux});
    }

    this.setCouponInCart(obj.id,true);

  }

  setCouponInCart(id,flag){

    const couponsAux = this.state.coupons.slice();
    for (var i = 0; i < couponsAux.length; i++) {
      if(couponsAux[i].id === id){
         couponsAux[i].isInCart = flag;
      }
    }
    this.setState({coupons:couponsAux});

  }

  isInCart(id){
    const items = this.state.items.slice(); 
    for (var i = 0; i < items.length; i++) {
        if(items[i].id === id){
           return true;
        }
    }
    return false;
  }

  remuveFromCart(obj) {
    const items = this.state.items.slice(); 
    for (var i = 0; i < items.length; i++) {
        if(items[i].id === obj.id){
           this.setState({total: this.state.total - Number(obj.price)});
           this.setState({quantItems:  this.state.quantItems - 1});
           items.splice(i,1);
           this.setState({items: items});
           this.setCouponInCart(obj.id,false);
           return;
        }
    } 
  }

  render() {

    const auxcoupons = [];

    for (var i = 0; i < this.state.coupons.length; i++) {
      auxcoupons.push(this.renderCoupons(this.state.coupons[i]));       
    }

    return (
       <div className="Store">
        <Cart showItems   = {true} 
              total       = {this.state.total}
              quantItems  = {this.state.quantItems}
              items       = {this.state.items}
              remuveFromCart= { (obj) => this.remuveFromCart(obj) }  
        />
			   <div id="listCoupon">
            {auxcoupons}
			   </div>
      </div>
    );
  }
}

// ========================================

class Coupon extends React.Component {

  constructor(props) {
    super(props);
    this.state   = {
        bTextValue:'Add Cart',
    };
  }

  render() {
    return (
      <div className="Coupon">
        <div className="grid-item"><button disabled={this.props.isInCart} onClick={() => this.props.onClick(this.props) } >{ this.state.bTextValue }</button></div>
    		<div className="grid-item"><label className="name">{ this.props.name }</label></div>
    		<div className="grid-item"><label className="product">{ this.props.product }</label></div>
    		<div className="grid-item"><label className="price">{ this.props.price }</label></div>
    		<div className="grid-item"><label className="date">{ this.props.date }</label></div>
      </div>
    );
  }
}

// ========================================

class Item extends Coupon {

 constructor(props) {
    super(props);
    this.state.bTextValue = 'Remuve';
  
  }

  render() {
    return (
      <div className="Item">
        <div className="grid-item"><button onClick={() => this.props.onClick(this.props.id)} > { this.state.bTextValue }</button></div>
        <div className="grid-item"><label className="name">{ this.props.name }</label></div>
    		<div className="grid-item"><label className="product">{ this.props.product }</label></div>
    		<div className="grid-item"><label className="price">{ this.props.price }</label></div>
    		<div className="grid-item"><label className="date">{ this.props.date }</label></div>
      </div>
    );
  }
}


// ========================================

class Cart extends React.Component {

	constructor(props) {
	    super(props);
      this.state   = {
         showItems:true,
       };
	}

  setShowItems(value){
    this.showItems.value  = value;
  }

	renderItem(item) {
	    return  (
        <Item 
           key      = { item.id } //warnings
           id       = { item.id } 
	         name   	= { item.name } 
	         product  = { item.product }
	         price    = { item.price }
	         date     = { item.date }
           onClick = { (obj) => this.props.remuveFromCart(item) }
	      />
      );
  }

  render() {
    const auxitems = [];
    

    if(this.props.items!=null){
      const items = this.props.items.slice(); 

      for (var i = 0; i < items.length; i++) {
        if(this.state.showItems){
          auxitems.push(this.renderItem(items[i]));
        }
      }

    }

    return (
    <div className="Cart">
    		<div id="statusCart">
          <div className="grid-item">
            <button
              onClick     = {() => this.setState({showItems: !this.state.showItems})}
            >
            { 
              this.state.showItems ? 'hide' : 'show'  
            }
            </button>
          </div>
    			<div className="grid-item"><label>Quantity Items:</label></div>
    			<div className="grid-item"><label>{ this.props.quantItems }</label></div>
    			<div className="grid-item"><label>Total</label></div>
    			<div className="grid-item"><label>${ this.props.total }</label></div>
    		</div>
        <div id="listItems">{  auxitems }</div>
	  </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Store />,
  document.getElementById('root')
);


