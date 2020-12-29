import {
  Button,
  Input,
  Select,
  Option,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Table,
  Form,
  FormItem,
  Row,
  Col,
  Popover,
  Pagination,
  TableColumn,
  Dialog,
  Upload,
  Step,
  Steps,
  Progress,
  Tree,
  Switch,
  MessageBox,
  Message,
} from 'element-ui';

const element = {
  install: function (Vue: any) {
    Vue.use(Button)
    Vue.use(Input)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(Checkbox)
    Vue.use(CheckboxGroup)
    Vue.use(DatePicker)
    Vue.use(Table)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Popover)
    Vue.use(TableColumn)
    Vue.use(Pagination)
    Vue.use(Dialog)
    Vue.use(Upload)
    Vue.use(Step)
    Vue.use(Steps)
    Vue.use(Progress)
    Vue.use(Tree)
    Vue.use(Switch)
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$message = Message
  }
}
export default element