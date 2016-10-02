require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import  ReactDOM from 'react-dom';

let imageDatas = require('../data/imgData.json');


imageDatas  = (function getImageURL(imageDataArr) {
    for(var i =0, j= imageDataArr.length;i<j;i++){
      var singleImageData= imageDataArr[i];
      singleImageData.imageURL = require('../images/'+ singleImageData.fileName);
      imageDataArr[i]  = singleImageData;
    }
    return imageDataArr;
  })(imageDatas);

// 在两个数字中随机生成
function getRangeRandom(Min,Max){
	return Math.ceil(Math.random()*(Max-Min)+Min)
}  
// 获取一个随机不大于30度的正负角度
function get30DegRandom(){
	return  (Math.random()>0.5 ?'':'-')+Math.ceil(Math.random()*30)
}
// 组件首字母大写
var ImgFigure = React.createClass({

	handleClick: function(e){
		if (this.props.arrange.isCenter) {
			this.props.inverse()
		} else {
			this.props.center();
		}
		e.stopPropagation()
		e.preventDefault()
	},
	render:function(){
		var styleObj ={};
	    if(this.props.arrange.pos){
	      styleObj = this.props.arrange.pos;
	    }
	    // 如果图片选装角度不为0则使用这个角度
	    if(this.props.arrange.rotate){
	    	styleObj['transform'] = 'rotate(' +this.props.arrange.rotate +'deg)';
	    }
	    var imgFigureClassName ='img-figure';
    	imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse':''; 
    	if(this.props.arrange.isCenter){
	      styleObj.zIndex =11;
	    }
		return(
				<figure className={imgFigureClassName}  style={styleObj} onClick = {this.handleClick}>
					<img src={this.props.data.imageURL}
						 alt={this.props.data.title}
						 onClick={this.handleClick}/>
					<figcaption>
						<h2 className="img-title">{this.props.data.title}</h2>
						<div className="img-back" onClick={this.handleClick}>
								<p>
									{this.props.data.desc}
								</p>
						</div>
					</figcaption>
				</figure>
			)
	}
})

class AppComponent extends React.Component {
	constructor(props){
    super(props);
    this.state ={
      imgsArrangeArr:[
        {
          pos:{
            left:0,
            top:0
          },
          rotate:0,//旋转角度
          isInverse:false,//正反面
          isCenter:false
        }
      ]
    };

    this.Constant= {
        centerPos:{
          left:0,
          right:0
        },
        hPosRange:{
          leftSecX:[0,0],
          rightSecX:[0,0],
          y:[0,0]
        },
        vPosRange:{
          x:[0,0],
          topY:[0,0]
        }
      }
  }
	// 制定居中是哪张图片
	center(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	}
	// 组件加载后,为每张图计算加载的范围
	componentDidMount(){
		// 获得舞台大小
		var stageDom = ReactDOM.findDOMNode(this.refs.stage),
		      stageW = stageDom.scrollWidth,
		      stageH = stageDom.scrollHeight,
		      halfStageW = Math.ceil(stageW / 2),
		      halfStageH = Math.ceil(stageH / 2);
		// 获取一个图片的大小
		var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
		      imgW  =imgFigureDom.scrollWidth,
		      imgH = imgFigureDom.scrollHeight,
		      halfImgW = Math.ceil(imgW / 2),
		      halfImgH = Math.ceil( imgH/2);
		      // 获得最中心图片位置
		    this.Constant.centerPos = {
		      left:halfStageW - halfImgW,
		      top:halfStageH - halfImgH
		    };	
		    // 计算左侧右侧图片排布的取值范围
		    this.Constant.hPosRange.leftSecX[0] = -halfImgH;
		    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		    this.Constant.hPosRange.rightSecX[0]= halfStageW + halfImgW;
		    this.Constant.hPosRange.rightSecX[1] =stageW - halfImgW;
		    this.Constant.hPosRange.y[0] = -halfImgH;
		    this.Constant.hPosRange.y[1] = stageH- halfImgH;
		    // 计算上侧图片排布的取值范围

		    this.Constant.vPosRange.topY[0] = -halfImgH;
		    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;

		    this.Constant.vPosRange.x[0] = halfStageW -imgW;
		    this.Constant.vPosRange.x[1] = halfStageW;

		    this.rearrange(0);
	}
	//这是一个输入当前被执行反转图片对应图片信息的index值
	//这是一个闭包函数,因为要读取函数外的值.
	inverse(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse  = ! imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });

    }.bind(this);
  }
	//随机图片的位置
	rearrange(centerIndex){
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			imgsArrangeTopArr = [],
			//取最中间最上面的图片个数,一个或不取
			topImgNum = Math.floor(Math.random()*2),
			// 用来标记在上侧布局的这个图片是从哪来的
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
			// 居中的图片位置 居中的图片不需要旋转
			imgsArrangeCenterArr[0] ={
				pos:centerPos,
				rotate:0,
				isCenter:true
			}
			// 获得布局上侧图片的信息,随机取一个
			topImgSpliceIndex = Math.ceil(Math.random()*imgsArrangeArr.length - topImgNum)
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
			// 布局位于上侧的图片
			imgsArrangeTopArr.forEach(function (value,index){
				imgsArrangeTopArr[index] = {
					pos:{
						top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
						left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
					},
					rotate:get30DegRandom(),
					isCenter:false
				}
			})
			// 布局左右两侧
			for(var i =0,j = imgsArrangeArr.length,k = j/2;i<j;i++){
				      var hPosRangeLORX = null;
				      if(i < k){
				        hPosRangeLORX = hPosRangeLeftSecX;
				      }else{
				        hPosRangeLORX = hPosRangeRightSecX;
				      }

				      imgsArrangeArr[i]={
				        pos:{
				          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
				            left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				        },
				        rotate:get30DegRandom(),
				        isCenter:false
				      }

				    }
			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
		      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		    }
		    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		    this.setState({
		      imgsArrangeArr:imgsArrangeArr
		    });
  }
  
  render() {
    var controllerUnits = [],
    	imgFigures = [];
    	imageDatas.forEach(function(value,index){
    		if (!this.state.imgsArrangeArr[index]) {
    			this.state.imgsArrangeArr[index]={
    				pos:{
    					left:0,
    					top:0
    				},
    				rotate:0,
    				isCenter:false
    			};
    		}
    		// 给ImgFigure绑定这些有用的函数,否则调用不到,类似inverse,
    		// center
    		imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center={this.center(index)}/>)
    	}.bind(this))
    return (
     <section className="stage" ref="stage" >
        <section className="img-sec">
        	{imgFigures}
        </section>
       <nav className="controller-nav">
       		{controllerUnits}
       </nav>
     </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
