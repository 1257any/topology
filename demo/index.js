import { Topology } from '../dist/togology-core/index';
import { registerNode } from '../dist/togology-core/middles';
import {
  flowData,
  flowDataAnchors,
  flowDataIconRect,
  flowDataTextRect,
  flowSubprocess,
  flowSubprocessIconRect,
  flowSubprocessTextRect,
  flowDb,
  flowDbIconRect,
  flowDbTextRect,
  flowDocument,
  flowDocumentAnchors,
  flowDocumentIconRect,
  flowDocumentTextRect,
  flowInternalStorage,
  flowInternalStorageIconRect,
  flowInternalStorageTextRect,
  flowExternStorage,
  flowExternStorageAnchors,
  flowExternStorageIconRect,
  flowExternStorageTextRect,
  flowQueue,
  flowQueueIconRect,
  flowQueueTextRect,
  flowManually,
  flowManuallyAnchors,
  flowManuallyIconRect,
  flowManuallyTextRect,
  flowDisplay,
  flowDisplayAnchors,
  flowDisplayIconRect,
  flowDisplayTextRect,
  flowParallel,
  flowParallelAnchors,
  flowComment,
  flowCommentAnchors
} from '../dist/togology-flow-diagram/topology-flow-diagram/index';
import { Data } from './data';

// Register flow diagrams.
registerNode('flowData', flowData, flowDataAnchors, flowDataIconRect, flowDataTextRect);
registerNode('flowSubprocess', flowSubprocess, null, flowSubprocessIconRect, flowSubprocessTextRect);
registerNode('flowDb', flowDb, null, flowDbIconRect, flowDbTextRect);
registerNode('flowDocument', flowDocument, flowDocumentAnchors, flowDocumentIconRect, flowDocumentTextRect);
registerNode(
  'flowInternalStorage',
  flowInternalStorage,
  null,
  flowInternalStorageIconRect,
  flowInternalStorageTextRect
);
registerNode(
  'flowExternStorage',
  flowExternStorage,
  flowExternStorageAnchors,
  flowExternStorageIconRect,
  flowExternStorageTextRect
);
registerNode('flowQueue', flowQueue, null, flowQueueIconRect, flowQueueTextRect);
registerNode('flowManually', flowManually, flowManuallyAnchors, flowManuallyIconRect, flowManuallyTextRect);
registerNode('flowDisplay', flowDisplay, flowDisplayAnchors, flowDisplayIconRect, flowDisplayTextRect);
registerNode('flowParallel', flowParallel, flowParallelAnchors, null, null);
registerNode('flowComment', flowComment, flowCommentAnchors, null, null);
// end.

var canvas = new Topology('topo-canvas', {});
canvas.render(Data, true);
