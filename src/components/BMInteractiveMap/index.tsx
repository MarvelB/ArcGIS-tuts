import { Esri } from "@/types";
import HomeWidget from "@arcgis/core/widgets/Home";
import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-block";
import "@esri/calcite-components/dist/components/calcite-chip";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-list";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-option";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-select";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-slider";
import "@esri/calcite-components/dist/components/calcite-tooltip";
import {
  CalciteAction,
  CalciteBlock,
  CalciteChip,
  CalciteLabel,
  CalciteList,
  CalciteListItem,
  CalciteOption,
  CalcitePanel,
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
  CalciteSelect,
  CalciteShell,
  CalciteShellPanel,
  CalciteSlider,
  CalciteTooltip,
} from "@esri/calcite-components-react";

import useBMFeatureLayer from "@/hooks/useBMFeatureLayer";
import useBMMap from "@/hooks/useBMMap";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import WebStyleSymbol from "@arcgis/core/symbols/WebStyleSymbol";
import FeatureLayerView from "@arcgis/core/views/layers/FeatureLayerView";
import TopFeaturesQuery from "@arcgis/core/rest/support/TopFeaturesQuery";
import TopFilter from "@arcgis/core/rest/support/TopFilter";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Graphic from "@arcgis/core/Graphic";
import {
  CalciteSegmentedControlCustomEvent,
  CalciteSelectCustomEvent,
  CalciteSliderCustomEvent,
} from "@esri/calcite-components";

import "./styles.css";

const BMInteractiveMap = () => {
  const templateProps = useMemo(() => {
    return {
      title: "{Park}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "F2022",
              label: "2022",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "F2021",
              label: "2021",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "F2020",
              label: "2020",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "F2019",
              label: "2019",
              format: {
                digitSeparator: true,
              },
            },
          ],
        },
      ],
    } as Esri.PopupTemplateProperties;
  }, []);

  const [renderer, setRenderer] = useState<SimpleRenderer>();

  const layer = useBMFeatureLayer(
    {
      url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/US_National_Parks_Annual_Visitation/FeatureServer/0",
      outFields: ["*"],
      popupTemplate: templateProps,
      renderer: renderer!,
    },
    !renderer
  );

  const [ref, webMap, webMapView] = useBMMap(
    {
      basemap: "streets-navigation-vector",
      layers: [layer!],
    },
    { padding: { top: 49 } },
    !layer
  );

  const [homeWidget, setHomeWidget] = useState<HomeWidget>();

  const [featureLayerView, setFeatureLayerView] = useState<FeatureLayerView>();

  const [graphics, setGraphics] = useState<Graphic[]>([]);

  const [year, setYear] = useState<string>("F2022");
  const [count, setCount] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<string>("DESC");

  const [disableResetFilters, setDisableResetFilters] = useState<boolean>(true);

  const handleItemClick = (
    e: React.MouseEvent<HTMLCalciteListItemElement>,
    graphic: Graphic,
    index: number
  ) => {
    e.preventDefault();
    console.log(graphic);
    const popUp = graphics && graphics[index];

    if (popUp) {
      webMapView!.popup.open({
        features: [popUp],
        location: graphic.geometry,
      });

      webMapView!.goTo(
        {
          center: [graphic.geometry.longitude, graphic.geometry.latitude],
          zoom: 4,
        },
        { duration: 400 }
      );
    }
  };

  const applyFilters = async () => {
    const query = new TopFeaturesQuery({
      topFilter: new TopFilter({
        topCount: count,
        groupByFields: ["State"],
        orderByFields: [`${year} ${orderBy}`],
      }),
      orderByFields: [`${year} ${orderBy}`],
      outFields: ["State, F2022, F2021, F2020, F2019, Park"],
      returnGeometry: true,
      cacheHint: true,
    });

    query.orderByFields = [""];

    const results = await layer!.queryTopFeatures(query);
    setGraphics(results.features);

    const objectIds = await layer!.queryTopObjectIds(query);
    query.topFilter;
    // console.log(objectIds, featureLayerView);
    featureLayerView!.filter = new FeatureFilter({ objectIds });
  };

  const handleFilters = (
    e:
      | CalciteSegmentedControlCustomEvent<void>
      | CalciteSelectCustomEvent<void>
      | CalciteSliderCustomEvent<void>,
    filterType: "year" | "orderBy" | "count"
  ) => {
    e.preventDefault();

    switch (filterType) {
      case "year":
        setYear(String(e.target.value));
        break;
      case "orderBy":
        setOrderBy(String(e.target.value));
        break;
      case "count":
        setCount(Number(e.target.value));
        break;
    }

    setDisableResetFilters(false);
  };

  const resetFilters = (
    e: React.MouseEvent<HTMLCalciteActionElement, MouseEvent>
  ) => {
    e.preventDefault();

    setYear("F2022");
    setCount(1);
    setOrderBy("DESC");

    setDisableResetFilters(true);
  };

  useEffect(() => {
    if (!featureLayerView || featureLayerView === null) return;

    applyFilters();
  }, [year, count, orderBy]);

  useEffect(() => {
    const symbol = new WebStyleSymbol({
      name: "park",
      styleName: "Esri2DPointSymbolsStyle",
    });

    symbol.fetchCIMSymbol().then((cimSymbol) => {
      setRenderer(
        new SimpleRenderer({
          symbol: cimSymbol,
        })
      );
    });
  }, []);

  useEffect(() => {
    if (!webMapView || webMapView === null || !webMap || webMap === null)
      return;

    (async () => {
      webMapView.ui.move("zoom", "bottom-right");

      const innerHomeWidget = new HomeWidget({
        view: webMapView,
      });

      setHomeWidget(innerHomeWidget);

      webMapView.ui.add(innerHomeWidget, "top-right");

      webMapView
        .whenLayerView(layer!)
        .then((layerView) => setFeatureLayerView(layerView));
    })();

    return () => {
      homeWidget && homeWidget.destroy();
    };
  }, [webMapView, webMap]);

  useEffect(() => {
    if (!featureLayerView || featureLayerView === null) return;

    applyFilters();

    return () => {
      featureLayerView && featureLayerView.destroy();
    };
  }, [featureLayerView]);

  return (
    <Box height="inherit" width="100%" paddingX="auto">
      <CalciteShell className="calcite-tutorial">
        <CalciteShellPanel slot="panel-start" position="start">
          <CalcitePanel heading="National Park Visitation">
            <CalciteBlock heading="Filters" open>
              <Box slot="control">
                <CalciteAction
                  icon="reset"
                  id="control-reset-el"
                  text=""
                  onClick={resetFilters}
                  {...(disableResetFilters
                    ? { disabled: true }
                    : { indicator: true })}
                ></CalciteAction>
                <CalciteTooltip
                  referenceElement="control-reset-el"
                  placement="bottom"
                  label=""
                >
                  Reset to defaults
                </CalciteTooltip>
              </Box>

              <CalciteLabel>
                Data type, per state
                <CalciteSegmentedControl
                  id="control-visited-type-el"
                  width="full"
                  value={orderBy}
                  onCalciteSegmentedControlChange={(e) => {
                    handleFilters(e, "orderBy");
                  }}
                >
                  <CalciteSegmentedControlItem value="DESC" checked>
                    Most visited
                  </CalciteSegmentedControlItem>
                  <CalciteSegmentedControlItem value="ASC">
                    Least visited
                  </CalciteSegmentedControlItem>
                </CalciteSegmentedControl>
              </CalciteLabel>

              <CalciteLabel>
                Year data to display
                <CalciteSelect
                  label="Year data to display"
                  id="control-year-el"
                  value={year}
                  onCalciteSelectChange={(e) => {
                    handleFilters(e, "year");
                  }}
                >
                  <CalciteOption label="2022" value="F2022"></CalciteOption>
                  <CalciteOption label="2021" value="F2021"></CalciteOption>
                  <CalciteOption label="2020" value="F2020"></CalciteOption>
                  <CalciteOption label="2019" value="F2019"></CalciteOption>
                </CalciteSelect>
              </CalciteLabel>

              <CalciteLabel>
                Max parks per state
                <CalciteSlider
                  id="control-count-per-state-el"
                  labelTicks
                  ticks={1}
                  min={1}
                  max={5}
                  value={count}
                  onCalciteSliderChange={(e) => {
                    handleFilters(e, "count");
                  }}
                ></CalciteSlider>
              </CalciteLabel>
            </CalciteBlock>

            <CalciteBlock collapsible heading="Results" id="result-block" open>
              <CalciteList id="result-list">
                {graphics.map((graphic, index) => (
                  <CalciteListItem
                    key={`${graphic.attributes.Park}-${graphic.attributes.State}-${index}`}
                    label={graphic.attributes.Park}
                    value={index}
                    description={`${graphic.attributes[
                      year
                    ].toLocaleString()} visitors`}
                    onClick={(e) => handleItemClick(e, graphic, index)}
                  >
                    <CalciteChip
                      slot="content-end"
                      value={graphic.attributes.State}
                      dangerouslySetInnerHTML={graphic.attributes.State}
                      scale="s"
                    ></CalciteChip>
                  </CalciteListItem>
                ))}
              </CalciteList>
            </CalciteBlock>
          </CalcitePanel>
        </CalciteShellPanel>

        <Box ref={ref} height="100%" className="calcite-mode-light" />
      </CalciteShell>
    </Box>
  );
};

export default BMInteractiveMap;
