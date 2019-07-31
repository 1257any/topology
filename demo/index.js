import { Topology } from '../dist/togology-core/index';
import { Data } from './data';

var canvas = new Topology('topo-canvas', {});
canvas.render(Data, true);
