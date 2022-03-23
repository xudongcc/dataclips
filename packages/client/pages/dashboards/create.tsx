import { PC } from "../../interfaces/PageComponent";
import ProjectLayout from "../../layouts/ProjectLayout";
import GridLayout from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { LineChartPreview } from "../../components/ChartResultPreview/components";
import { Card } from "../../components/Card/Card";

const DashBoardCreate: PC = () => {
  const layout = [{ i: "c", x: 4, y: 0, w: 6, h: 12 }];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
    >
      <Card key="c">
        <LineChartPreview
          result={{
            duration: 3743,
            id: "588759724933750785",
            name: "折线",
            fields: ["key", "value", "value2"],
            values: [
              ["应点击主页数量", "636", "626"],
              ["主页能打开数量", "624", "614"],
              ["帖子能打开数量", "624", "614"],
              ["广告已打开数量", "569", "559"],
              ["有花钱主页数量", "527", "517"],
              ["有点击主页数量", "368", "358"],
              ["有评论主页数量", "368", "358"],
            ],
          }}
          config={{
            xCol: "key",
            yCol: [
              { label: "value", value: "value" },
              { label: "value2", value: "value2" },
            ],
          }}
        />
      </Card>
    </GridLayout>
  );
};

DashBoardCreate.layout = ProjectLayout;

export default DashBoardCreate;
