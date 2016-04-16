/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 
 /*global React*/
 /*global $*/
 /*global ReactDOM*/
 
var Del_btn = React.createClass({
	onClick : function() {
		this.props.onAfternoonTeaDelete();		
	},
	render:function() {
		return (
		<div>
			<button onClick={this.onClick}>Delete</button>
		</div>
		);
	}
});	
 
var Sub_btn = React.createClass({
	onClick : function() {
		var vote_count = Math.max(this.props.count-1,0);
		this.props.onAfternoonTeaClick(vote_count);		
	},
	render:function() {
		return (
		<div>
			<button onClick={this.onClick}>-</button>
		</div>
		);
	}
});	
 
var Add_btn = React.createClass({
	onClick : function() {
		var vote_count = this.props.count+1;
		this.props.onAfternoonTeaClick(vote_count);		
	},
	render:function() {
		return (
		<div>
			<button onClick={this.onClick}>+</button>
		</div>
		);
	}
});	

var AfternoonTea = React.createClass({
	onAfternoonTeaUpdate : function(vote_count) {
		this.setState({ count: vote_count});
		var temp = {name: this.props.name, type: this.props.type, money: this.props.money, count: vote_count, url:this.props.url};
		$.ajax({
      		url: this.props.url+"/"+this.props.id,
      		dataType: 'json',
      		type: 'PUT',
      		data: temp,
      		success: function(data) {
        	//	this.setState({data: data});
      		}.bind(this),
      		error: function(xhr, status, err) {
        		console.error(this.props.url, status, err.toString());
      		}.bind(this)
    	});
	},
	onAfternoonTeaDelete : function() {
		var delData;
    	$.ajax({
      		url: this.props.url+"/"+this.props.id,
      		dataType: 'json',
      		cache: false,
      		success: function(data) {
        		this.setState({delData: data});
      		}.bind(this),
      		error: function(xhr, status, err) {
        		console.error(this.props.url, status, err.toString());
      		}.bind(this)
    	});
    	$.ajax({
      		url: this.props.url+"/"+this.props.id,
      		dataType: 'json',
      		type: 'DELETE',
      		data: delData,
      		success: function() {
        	//	this.setState({data: data});
      		}.bind(this),
      		error: function(xhr, status, err) {
        		console.error(this.props.url, status, err.toString());
      		}.bind(this)
    	});
	},
	render: function() {
		return (
                <tr>
				  <td>{this.props.name}</td>
				  <td>{this.props.type}</td>
				  <td>{this.props.money}</td>
				  <td>{this.props.count}</td>
				  <td><Add_btn count={this.props.count} onAfternoonTeaClick={this.onAfternoonTeaUpdate} />
				      <Sub_btn count={this.props.count} onAfternoonTeaClick={this.onAfternoonTeaUpdate} /></td>
				  <td><Del_btn count={this.props.count} onAfternoonTeaDelete={this.onAfternoonTeaDelete}></Del_btn></td>
                </tr>
                

		);
	}
});

// 下午茶投票清單
var AfternoonTeaList = React.createClass({
	getInitialState : function() {	
		return {abc: 0};
	},
  	render: function() {
		var total_money = 0;
    	var datalist = this.props.data.map(function(list, index) {
			total_money = total_money + list.money * list.count;
      		return (
        		<AfternoonTea name={list.name}  type={list.type} money={list.money} count={list.count} id={list.id} key={index} url={list.url} />
      		);
    	});

    	return (
		<div>
      		<table>
                <thead>
                <tr>
                    <th width="100">Name</th>
                    <th width="100">Type</th>
					<th width="100">Money</th>					
					<th width="100">Count</th>
					<th width="100">Order</th>
					<th width="100">Delete</th>
                </tr>
                </thead>
                <tbody>{datalist}</tbody>
				<tfoot>
					<tr>
						<th>Total</th>
						<th>{total_money}</th>
					</tr>
				</tfoot>
            </table>
		</div>
			
    	);
  	}
});

var AfternoonTeaForm = React.createClass({
	getInitialState: function() {
    	return {name: '', type: '', money: '', quantity: ''};
	},
  	handleNameChange: function(e) {
    	this.setState({name: e.target.value});
  	},
  	handleTypeChange: function(e) {
    	this.setState({type: e.target.value});
  	},
	handleMoneyChange: function(e) {
    	this.setState({money: e.target.value});
  	},
  	handleQuantityChange: function(e) {
    	this.setState({quantity: e.target.value});
  	},
  	handleSubmit: function(e) {
    	e.preventDefault();
    	var name = this.state.name.trim();
    	var type = this.state.type.trim();
		var money = this.state.money.trim();
		var quantity = this.state.quantity.trim();
		if (!type || !name || !money) {
			alert("請輸入Name/Type/Money");
			return;
    	}
    	this.props.onAfternoonTeaSubmit({name: name, type: type, money: money, count: quantity, url:this.props.url});
    	this.setState({name: '', type: '', money:'', quantity:''});
  	},
  	render: function() {
    	return (
      		<form className="listForm" onSubmit={this.handleSubmit}>
      			<p>------------ Add afternoon tea list ------------</p>
      			<p>
      				Name : 
        			{'  '}
        			<input type="text" placeholder="Add name" value={this.state.name} onChange={this.handleNameChange} />
        		</p>
        		<p>
        			Type of Afternoon tea : 
        			{'  '}
        			<input type="text" placeholder="Add kind" value={this.state.type} onChange={this.handleTypeChange} />
        		</p>
				<p>
					Money of Afternoon tea : 
        			{'  '}
        			<input type="text" placeholder="Add money" value={this.state.money} onChange={this.handleMoneyChange} />
        		</p>
        		<p>
					Quantity: 
        			{'  '}
        			<input type="text" placeholder="Add quantity" value={this.state.quantity} onChange={this.handleQuantityChange} />
        		</p>
        		<input type="submit" value="Send" />
      		</form>
    	);
  	}
});

var AfternoonTeaBox = React.createClass({
  	loadAfternoonTeaFromServer: function() {
    	$.ajax({
      		url: this.props.url,
      		dataType: 'json',
      		cache: false,
      		success: function(data) {
        		this.setState({data: data});
      		}.bind(this),
      		error: function(xhr, status, err) {
        		console.error(this.props.url, status, err.toString());
      		}.bind(this)
    	});
  	},
  	handleAfternoonTeaSubmit: function(list) {
    	var lists = this.state.data;
    	var newAfternoonTea = lists.concat([list]);

    	this.setState({data: newAfternoonTea});

    	$.ajax({
      		url: this.props.url,
      		dataType: 'json',
      		type: 'POST',
      		data: list,
      		success: function(data) {
        	//	this.setState({data: data});
      		}.bind(this),
      		error: function(xhr, status, err) {
        		this.setState({data: lists});
        		console.error(this.props.url, status, err.toString());
      		}.bind(this)
    	});
  	},
  	getInitialState: function() {
    	return {data: []};
  	},
  	componentDidMount: function() {
    	this.loadAfternoonTeaFromServer();
    	setInterval(this.loadAfternoonTeaFromServer, this.props.pollInterval);
  	},
  	render: function() {
    	return (
      		<div className="listBox">
        		<h1>Afternoon Tea</h1>
        		<AfternoonTeaList  data={this.state.data} />
        		<AfternoonTeaForm onAfternoonTeaSubmit={this.handleAfternoonTeaSubmit} url={this.props.url} />
      		</div>
    	);
  	}
});

ReactDOM.render(
  	<AfternoonTeaBox url="https://yd-tea-yender.c9users.io/afternoontea" pollInterval={100} />,
  	document.getElementById('content')
);
