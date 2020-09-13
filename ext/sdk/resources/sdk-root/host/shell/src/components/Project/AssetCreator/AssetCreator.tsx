import React from 'react';
import { resourceNamePattern } from '../../../constants/patterns';
import { ProjectContext } from '../../../contexts/ProjectContext';
import { AssetCreateRequest, assetKinds, FilesystemEntry } from '../../../sdkApi/api.types';
import { assetApi } from '../../../sdkApi/events';
import { sendApiMessage } from '../../../utils/api';
import { invariant } from '../../../utils/invariant';
import { Button } from '../../controls/Button/Button';
import { Input } from '../../controls/Input/Input';
import { combineVisibilityFilters, Explorer, getRelativePath, visibilityFilters } from '../../Explorer/Explorer';
import { Modal } from '../../Modal/Modal';
import s from './AssetCreator.module.scss';


const resourceFolderSelectableFilter = (entry: FilesystemEntry) => {
  return entry.isDirectory && !entry.meta.isResource;
};
const resourceFolderVisibilityFilter = combineVisibilityFilters(
  visibilityFilters.hideAssets,
  visibilityFilters.hideFiles,
  visibilityFilters.hideDotFilesAndDirs,
);

export const AssetCreator = React.memo(() => {
  const { project, assetCreatorDir, closeAssetCreator } = React.useContext(ProjectContext);

  invariant(project, `AssetCreator has been rendered without project set`);

  const [assetName, setAssetName] = React.useState('');
  const [assetPath, setAssetPath] = React.useState(assetCreatorDir);

  // In case if path has been changed we should be acknowledged
  React.useEffect(() => {
    setAssetPath(assetCreatorDir);
  }, [assetCreatorDir, setAssetPath]);

  const handleCreateResource = React.useCallback(() => {
    if (assetName && project) {
      const request: AssetCreateRequest = {
        assetName,
        assetPath,
        projectPath: project.path,
        assetKind: assetKinds.resource,
      };

      sendApiMessage(assetApi.create, request);

      closeAssetCreator();
    }
  }, [assetName, project, assetPath, closeAssetCreator]);

  const resourceRelativePath = getRelativePath(project.path, assetPath);
  const resourcePathHint = assetPath === project.path
    ? 'Path: project root'
    : `Path: ${resourceRelativePath}`;

  return (
    <Modal onClose={closeAssetCreator}>
      <div className={s.root}>
        <div className="modal-header">
          Create Asset
        </div>

        <div className="modal-label">
          {resourcePathHint}
        </div>

        <Explorer
          className={s.explorer}
          basePath={project.path}
          pathsMap={project.fsTree.pathsMap}
          selectedPath={assetPath}
          onSelectPath={setAssetPath}
          selectableFilter={resourceFolderSelectableFilter}
          visibilityFilter={resourceFolderVisibilityFilter}
        />

        <Input
          label="Resource name"
          placeholder="kiwigrape-matchmaking"
          value={assetName}
          pattern={resourceNamePattern}
          className={s['name-input']}
          onChange={setAssetName}
          onSubmit={handleCreateResource}
        />

        <div className="modal-actions">
          <Button
            text="Create"
            theme="primary"
            onClick={handleCreateResource}
            disabled={!assetName}
          />
          <Button
            text="Cancel"
            onClick={closeAssetCreator}
          />
        </div>
      </div>
    </Modal>
  );
});
