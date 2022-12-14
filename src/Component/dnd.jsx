import { getNewOption } from './Option.jsx';
import './Option.jsx';
import { Component } from 'react';
import * as echarts from 'echarts';
import BarChart from './BarChart';

let itemTarget = null; //dragItem
let swapTarget = null; //dropItem

const item = document.querySelectorAll('.item-container');
const left = document.querySelector('.left');
const right = document.querySelector('.right');
const center = document.querySelector('.center');

class Dnd extends Component {
  chartResize = () => {
    const item = {
      target: itemTarget.firstElementChild.firstElementChild,
      isDouble: itemTarget.closest('[data-isDouble]'),
    };

    const swapItem = {
      target: swapTarget.parentElement.parentElement,
      isDouble: swapTarget.closest('[data-isDouble]'),
    };
    const centerResult = document.querySelector('.center');

    if (item.isDouble) {
      item.target.parentElement.childNodes[9].childNodes.forEach((child) => {
        if (child.tagName === 'DIV') {
          const echartInstance = echarts.getInstanceByDom(child);
          const newOption = getNewOption(
            echartInstance,
            centerResult.contains(itemTarget),
            child.id
          );
          echartInstance.setOption(newOption);
          echartInstance.resize();
        }
      });
    } else {
      const echartInstance = echarts.getInstanceByDom(
        item.target.nextElementSibling.nextElementSibling.nextElementSibling
          .nextElementSibling
      );
      const newOption = getNewOption(
        echartInstance,
        centerResult.contains(itemTarget),
        item.target.nextElementSibling.nextElementSibling.nextElementSibling
          .nextElementSibling.id
      );
      echartInstance.setOption(newOption);
      echartInstance.resize();
    }

    if (swapItem.isDouble) {
      swapItem.target.parentElement.childNodes.forEach((child) => {
        if (child.tagName === 'DIV') {
          const echartInstance = echarts.getInstanceByDom(child);
          const newOption = getNewOption(
            echartInstance,
            centerResult.contains(swapTarget),
            child.id
          );
          echartInstance.setOption(newOption);
          echartInstance.resize();
        }
      });
    } else {
      const echartInstance = echarts.getInstanceByDom(swapItem.target);
      const newOption = getNewOption(
        echartInstance,
        centerResult.contains(swapTarget),
        swapItem.target.id
      );
      echartInstance.setOption(newOption);
      echartInstance.resize();
    }
  };

  handleDragStart = (event) => {
    console.log(event);
    itemTarget = event.target;
  };
  //????????? ??? ????????? ?????? ?????? ?????? ??????
  handleDragOver = (event) => {
    console.log(event);
    event.preventDefault();
    const startTarget = event.target.parentElement.parentElement; //????????? ?????? ????????? main ????????????

    //left??????
    if (startTarget.className === 'left') {
      left.classList.add('dragOver');
    }
    if (event.target.parentElement.className === 'left') {
      left.classList.add('dragOver');
    }
    if (
      startTarget.parentElement.parentElement.parentElement?.className ===
      'left'
    ) {
      left.classList.add('dragOver');
    }

    //center??????
    if (
      startTarget.parentElement.parentElement.parentElement?.className ===
      'center'
    ) {
      center.classList.add('dragOver');
    }

    //right??????
    if (startTarget.className === 'right') {
      right.classList.add('dragOver');
    }
    if (event.target.parentElement.className === 'right') {
      right.classList.add('dragOver');
    }
    if (
      startTarget.parentElement.parentElement.parentElement?.className ===
      'right'
    ) {
      right.classList.add('dragOver');
    }
  };

  //??????????????? ????????? ????????? ?????? ????????? ?????????
  handleDragLeave = () => {
    left.classList.remove('dragOver');
    center.classList.remove('dragOver');
    right.classList.remove('dragOver');
  };

  //????????? ???????????? ???
  handleDrop = (event) => {
    event.preventDefault();

    left.classList.remove('dragOver');
    center.classList.remove('dragOver');
    right.classList.remove('dragOver');

    swapTarget = event.target;
    const target = event.target.closest('.item-container');

    const dragParentId = itemTarget.parentElement.id;
    const targetParentId = target.parentElement.id;

    const newArrLeft = [...this.left.children];
    const newArrRight = [...this.right.children];
    const newArrCenter = [...this.center.children];

    // ?????? <-> ??????
    if (dragParentId === 'left' && targetParentId === 'left') {
      let dragIdx;
      let targetIdx;
      newArrLeft.forEach((object, i) => {
        if (object.id === itemTarget.id) dragIdx = i;
        if (object.id === target.id) targetIdx = i;
      });

      [newArrLeft[targetIdx], newArrLeft[dragIdx]] = [
        newArrLeft[dragIdx],
        newArrLeft[targetIdx],
      ];

      newArrLeft.forEach((item) => {
        left.appendChild(item);
      });

      // chartResize();
    }

    // ????????? <-> ?????????
    else if (dragParentId === 'right' && targetParentId === 'right') {
      let dragIdx;
      let targetIdx;
      newArrRight.forEach((object, i) => {
        if (object.id === itemTarget.id) dragIdx = i;
        if (object.id === target.id) targetIdx = i;
      });

      [newArrRight[targetIdx], newArrRight[dragIdx]] = [
        newArrRight[dragIdx],
        newArrRight[targetIdx],
      ];

      newArrRight.forEach((item) => {
        right.appendChild(item);
      });
      // chartResize();
    }

    // ?????? -> ?????????
    else if (dragParentId === 'left' && targetParentId === 'center') {
      const dragIdx = newArrLeft.findIndex((object) => {
        //????????? ?????? ???????????? ????????? ?????? ??????
        return object.id === itemTarget.id;
      });

      const targetIdx = newArrCenter.findIndex((object) => {
        return object.id === target.id;
      });

      [newArrCenter[targetIdx], newArrLeft[dragIdx]] = [
        newArrLeft[dragIdx],
        newArrCenter[targetIdx],
      ];

      newArrLeft.forEach((item) => {
        left.appendChild(item);
      });

      newArrCenter.forEach((item) => {
        center.appendChild(item);
      });
      // chartResize();
    }

    // ????????? -> ?????????
    else if (dragParentId === 'right' && targetParentId === 'center') {
      const dragIdx = newArrRight.findIndex((object) => {
        return object.id === itemTarget.id;
      });

      const targetIdx = newArrCenter.findIndex((object) => {
        return object.id === target.id;
      });

      [newArrCenter[targetIdx], newArrRight[dragIdx]] = [
        newArrRight[dragIdx],
        newArrCenter[targetIdx],
      ];

      newArrRight.forEach((item) => {
        right.appendChild(item);
      });

      newArrCenter.forEach((item) => {
        center.appendChild(item);
      });
      // chartResize();
    }
    // ?????? -> ?????????
    else if (dragParentId === 'left' && targetParentId === 'right') {
      const dragIdx = newArrLeft.findIndex((object) => {
        return object.id === itemTarget.id;
      });

      const targetIdx = newArrRight.findIndex((object) => {
        return object.id === target.id;
      });

      [newArrLeft[targetIdx], newArrRight[dragIdx]] = [
        newArrRight[dragIdx],
        newArrLeft[targetIdx],
      ];

      newArrLeft.forEach((item) => {
        left.appendChild(item);
      });

      newArrRight.forEach((item) => {
        right.appendChild(item);
      });
      // chartResize();
    }
    // ????????? -> ??????
    else if (dragParentId === 'right' && targetParentId === 'left') {
      const dragIdx = newArrRight.findIndex((object) => {
        return object.id === itemTarget.id;
      });

      const targetIdx = newArrLeft.findIndex((object) => {
        return object.id === target.id;
      });

      [newArrRight[targetIdx], newArrLeft[dragIdx]] = [
        newArrLeft[dragIdx],
        newArrRight[targetIdx],
      ];

      newArrLeft.forEach((item) => {
        left.appendChild(item);
      });

      newArrRight.forEach((item) => {
        right.appendChild(item);
      });
      // chartResize();
    }
  };

  render() {
    return (
      <BarChart
        onDragStart={this.handleDragStart}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      />
    );
  }
}

console.log('TEST', this, item);
item.forEach((event) => {
  event.addEventListener('dragstart', () => {
    console.log(event);
    itemTarget = event.target;
  });
  event.addEventListener('dragover', this.handleDragOver);
  event.addEventListener('dragleave', this.handleDragLeave);
  event.addEventListener('drop', this.handleDrop);
  console.log(this);
});
export default Dnd;
