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
// 组件首字母大写
var ImgFigure = React.createClass({
	render:function(){
		return(
				<figure className="img-figure">
					<img src={this.props.data.imageURL}
						 alt={this.props.data.title}		
					/>
					<figcaption>
						<h2 className="img-title">{this.props.data.title}</h2>
					</figcaption>

				</figure>
			)
	}
})

class AppComponent extends React.Component {
	Constant:{
		centerPos:{
          left:0,
          right:0
        },
        // 水平方向的取值范围
        hPosRange:{
          leftSecX:[0,0],
          rightSecX:[0,0],
          y:[0,0]
        },
        // 垂直方向的取值范围
        vPosRange:{
          x:[0,0],
          topY:[0,0]
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
		var stageDOM = React.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
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
	inverse(index){
		return function(){
			// this.state用来读取对象的属性
			var imgsArrangeArr = this.state.imgsArrangeArr;
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
			// 居中的图片位置
			imgsArrangeCenterArr[0].pos = centerPos;
			// 获得布局上侧图片的信息,随机取一个
			topImgSpliceIndex = Math.ceil(Math.random()*imgsArrangeArr.length - topImgNum)
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
			// 布局位于上侧的图片
			imgsArrangeTopArr.forEach(function (value,index){
				imgsArrangeTopArrp[index].pos = {
					top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
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
				        }
				      }

				    }
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
    				}
    			}
    		}
    		imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index}/>)
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
