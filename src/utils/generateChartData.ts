type columnChartOptionsProps = {
  categories: string[];
  series: {
    showInLegend: boolean;
    name: string;
    data: number[];
  }[];
};

export const columnChartOptions = ({
  categories,
  series,
}: columnChartOptionsProps) => {
  return {
    chart: {
      type: "column",
    },

    title: {
      text: "",
    },

    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
    },

    xAxis: {
      categories: categories,
      labels: {
        x: -10,
      },
    },

    yAxis: {
      // visible: false,
      allowDecimals: false,
      title: {
        text: "",
      },
    },

    series: series.map((serie) => serie),

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: "100%",
          },
          chartOptions: {
            legend: {
              align: "center",
              verticalAlign: "bottom",
              layout: "horizontal",
            },
            yAxis: {
              visible: false,
              labels: {
                align: "left",
                x: 0,
                y: -5,
              },
              title: {
                text: null,
              },
            },
            subtitle: {
              text: null,
            },
            credits: {
              enabled: false,
            },
          },
        },
      ],
    },
  };
};
