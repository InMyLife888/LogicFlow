import { h, Component } from 'preact';
import GraphModel from '../../model/GraphModel';
import { StepDrag } from '../../util/drag';
import Text from '../basic-shape/Text';
import { IBaseModel } from '../../model/BaseModel';
import { ElementState } from '../../constant/constant';

type IProps = {
  model: IBaseModel;
  graphModel: GraphModel;
  draggable: boolean;
  editable: boolean;
};
type IState = {
  isHoverd: boolean;
};

export default class BaseText extends Component<IProps, IState> {
  dragHandler: (ev: MouseEvent) => void;
  sumDeltaX = 0;
  sumDeltaY = 0;
  stepDrag: StepDrag;
  constructor(config) {
    super();
    const { model, draggable } = config;
    this.stepDrag = new StepDrag({
      onDraging: this.onDraging,
      step: 1,
      model,
      isStopPropagation: draggable,
    });
  }
  getShape() {
    const { model } = this.props;
    const { text } = model;
    const { value, x, y } = text;
    const attr = {
      x,
      y,
      className: 'lf-element-text',
      value,
    };
    const style = model.getTextStyle();
    return (
      <Text {...attr} {...style} model={model} />
    );
  }
  onDraging = ({ deltaX, deltaY }) => {
    const {
      model,
      graphModel: {
        transformModel,
      },
    } = this.props;
    const [curDeltaX, curDeltaY] = transformModel.fixDeltaXY(deltaX, deltaY);
    model.moveText(curDeltaX, curDeltaY);
  };
  dblClickHandler = () => {
    // 静默模式下，双击不更改状态，不可编辑
    const { editable } = this.props;
    if (editable) {
      const { model } = this.props;
      model.setElementState(ElementState.TEXT_EDIT);
    }
  };
  mouseDownHandle = (ev: MouseEvent) => {
    const {
      draggable,
      graphModel: {
        editConfigModel: { nodeTextDraggable },
      },
    } = this.props;
    if (draggable || nodeTextDraggable) {
      this.stepDrag.handleMouseDown(ev);
    }
  };
  render() {
    const { model: { text } } = this.props;
    if (text) {
      return (
        <g onMouseDown={this.mouseDownHandle} onDblClick={this.dblClickHandler}>
          {
            this.getShape()
          }
        </g>
      );
    }
  }
}
