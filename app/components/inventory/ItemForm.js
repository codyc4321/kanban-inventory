import React, {Component} from "react";
import axios from "axios";

export default class ItemForm extends Component {
    constructor() {
        super();

        this.state = {
            companyName: "",
            item: "",
            unitSize: "",
            area1: "",
            color1: "",
            area2: "",
            color2: "",
            dailyNeed: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createItem = this.createItem.bind(this);
        this.color2 = this.color2.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }
componentWillReceiveProps() {
    this.setState({companyName: this.props.companyName});
    this.props.companyName ?

    //axios request to get the existing areas for this company
    axios.get(`/api/area/${this.props.companyName}`).then( results => {
       console.log(`axios get api/area working in componentDidMount, data: ${JSON.stringify(results.data)}`);
       $(".selection1").empty();
       $(".selection2").empty();
       var data = results.data;
       //dynamically create the form options based on the existing areas
       var option = $("<option>");
       option.text("");
       $(".selection1").append(option);
       for(var i=0;i<data.length;i++) {
         option = $("<option>");
         option.text(data[i].area);
         $(".selection1").append(option);
       } 
      //do the same for section 2, it's the same information but problems with asychronous function
       var option2 = $("<option>");
       option2.text("");
       $(".selection2").append(option2);
       for(var i=0;i<data.length;i++) {
         option2 = $("<option>");
         option2.text(data[i].area);
         $(".selection2").append(option2);
       }  
    }) : console.log(`this.props.companyName not received yet in ItemForm`);
}
handleChange(event){
    var newState = {};
    newState[event.target.id] = event.target.value;
    this.setState(newState);
}
createItem() {
    var data= this.state;
    console.log(`this data: ${JSON.stringify(data)}`)
    axios.post("/api/item", data).then( response => {
      console.log(`item response: ${JSON.stringify(response.data)}`);
    }).catch(function(err) {
      console.log(err);
    });
      this.setState({item: "", unitSize: "", area1: "", color1: "", area2: "", color2: "", dailyNeed:""});
}
color2 () {
        if (this.state.area2) {
          axios.get(`/api/areaColor/${this.props.companyName}/${this.state.area2}`).then( results => {
            this.setState({color2: results.data});
            console.log(`api/areaColor GET request results: ${JSON.stringify(results.data)}`);
            console.log(`this.state.color2: ${JSON.stringify(this.state.color2)}`);
            this.createItem();
         });
        }
        else {
          this.createItem();
        } 
}
handleSubmit(event){
  console.log("handleSubmit is working");
  event.preventDefault();
        //variables to validate if the dailNeed was entered as a float variable        
        var floatValue = this.state.dailyNeed;
        var decimal=  /^[-+]?[0-9]+\.[0-9]+$/;  
        var data = this.state;
        console.log(`Number.isInteger(floatValue): ${Number.isInteger(parseInt(floatValue))}`);
        
        //validate that the necessary form data has been entered
        if (data.item === "") {
            alert("Please enter the name for the item");
          }
          else if (data.unitSize === "") {
            alert("Please enter the unit size");
          }
          else if (data.area1 === "" && data.area2 === "") {
            alert("Please select at least one area");
          }
          else if (data.dailyNeed === "") {
            alert("Please enter the daily need");
          }
          else if(floatValue.match(decimal) || Number.isInteger(parseInt(floatValue))) {   
          console.log('float data is validated');  
          //axios request to retrieve colors associated with areas
          axios.get(`/api/areaColor/${this.props.companyName}/${this.state.area1}`).then( results => {
                this.setState({color1: results.data});
              console.log(`api/areaColor GET request results: ${JSON.stringify(results.data)}`);
              console.log(`this.state.color1: ${JSON.stringify(this.state.color1)}`);
              this.color2();
          });
        }  
        else {   
          alert('Please enter an integer or a decimal value for the Daily Need.\n\nFor example:\nFor one half of a 20lb Box enter: 0.5 or .5\nFor one whole 20lb Box enter: 1 or 1.0');  
          return;  
        }    
}
render() {
    return (
      
      <div className="container">
        <div className="newItemContainer">
          <div className="row">
            <div className="col-md-12">
              <h2>Create New Item</h2>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="item">Item Name</label>
                  <input 
                  type="text" 
                  value={this.state.item}
                  onChange={this.handleChange}
                  className="form-control" 
                  id="item" 
                  placeholder="enter item name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unitSize">Unit Size</label>
                  <input 
                  type="text" 
                  value={this.state.unitSize}
                  onChange={this.handleChange}
                  className="form-control" 
                  id="unitSize" 
                  placeholder="enter unit size (e.g. 20lb box)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dailyNeed">Daily Need (decimals)</label>
                  <input 
                  type="text" 
                  value={this.state.dailyNeed}
                  onChange={this.handleChange}
                  className="form-control" 
                  id="dailyNeed" 
                  placeholder="units used per day in decimals (e.g. 0.2)"
                  />
                </div>               
                <div className="form-group">
                  <label htmlFor="area1">Select Area 1</label>
                  <select
                  value={this.state.area1}
                  onChange={this.handleChange}
                  className="form-control selection1" 
                  id="area1" 
                  placeholder="select area 1"
                  >
                 </select>
                </div>
                <div className="form-group">
                  <label htmlFor="area2">Select Area 2</label>
                  <select
                  value={this.state.area2}
                  onChange={this.handleChange}
                  className="form-control selection2" 
                  id="area2" 
                  placeholder="select area 2"
                  >
                 </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>        
      </div>
    );

  }
}