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
/*global $*/
/*global React*/
/*global Scott*/
var AfternoonTea = React.createClass({
	render: function() {
		return (
			<tr>
				<td>{this.props.name}</td>
				<td>{this.props.type}</td>
				<td>{this.props.money}</td>
				<td>{this.props.vote}</td>
				<td><Vote_btn name={this.props.name} type={this.props.type} money={this.props.money} vote={this.props.vote}></Vote_btn></td>
			</tr>
		);
	}
});

var Vote_btn = React.createClass({
	getInitialState : function() {	
		return {
			count: this.props.vote
		};
	},
	onClick : function() {
		var vote_count = this.state.count+1;
		alert(vote_count);
		this.setState({ count: this.state.count + 1});
		this.props.onAfternoonTeaClick({vote: vote_count});		
	},
	render:function() {
		return (
		<div>
			<span>{this.state.count}</span>
			<button onClick={this.onClick}>add</button>
		</div>
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
    	//list.id = Date.now();
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
  	handleAfternoonTeaClick: function(list) {
    	var lists = this.state.data;
    	//list.id = Date.now();
    	var newAfternoonTea = lists.concat([list]);
    	this.setState({data: newAfternoonTea});
		alert(list);
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
        		<AfternoonTeaForm onAfternoonTeaSubmit={this.handleAfternoonTeaSubmit} />
      		</div>
    	);
  	}
});

// 下午茶投票清單
var AfternoonTeaList = React.createClass({
  	render: function() {
		var total_money = 0;
    	var datalist = this.props.data.map(function(list, index) {
			total_money += list.money * list.vote;
      		return (
        		<AfternoonTea name={list.name}  type={list.type} money={list.money} vote={list.vote} id={list.id} key={index}></AfternoonTea>
      		);
    	});
		//alert(total_money);
    	return (
		<div>
      		<table>
                <thead>
                <tr>
                    <th width="100">Name</th>
                    <th width="100">Type</th>
					<th width="100">Money</th>					
					<th width="100">Count</th>
					<th width="100">Vote</th>
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
			<div></div>
		</div>
			
    	);
  	}
});

var AfternoonTeaForm = React.createClass({
	getInitialState: function() {
    	return {name: '', type: '', money: ''};
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
  	handleSubmit: function(e) {
    	e.preventDefault();
    	var name = this.state.name.trim();
    	var type = this.state.type.trim();
		var money = this.state.money.trim();
		if (!type || !name || !money) {
			alert("請輸入Name/Type/Money");
			return;
    	}
    	this.props.onAfternoonTeaSubmit({name: name, type: type, money: money});
    	this.setState({name: '', type: '', money:''});
  	},
  	render: function() {
    	return (
      		<form className="listForm" onSubmit={this.handleSubmit}>
      			<p>------------ Add afternoon tea list ------------</p>
      			<p>
      				Dessert/Drink Name : 
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
        		<input type="submit" value="Send" />
      		</form>
    	);
  	}
});

ReactDOM.render(
  	<AfternoonTeaBox url="https://web-study-group-rightson.c9users.io/afternoontea" pollInterval={2000} />,
  	document.getElementById('content')
);
