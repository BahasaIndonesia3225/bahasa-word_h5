import PieChart from "./charts/pieChart";
import './index.less';

export default () => {
  return (
    <div className='dataAnalysis'>
      <div className='chartContain'>
        <PieChart />
      </div>
    </div>
  )
}
