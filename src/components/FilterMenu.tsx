import { Badge, Button, Card, Group, Menu, Stack } from "@mantine/core";
import { IconFilter } from "@tabler/icons";
import React, { useMemo } from "react";

import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { FieldType, IField } from "../interfaces/documents/IField";

import DynamicField from "./DynamicField";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { toggleFilterOpen } from "../redux/slices/filterSlice";
import { getDocuments } from "../redux/api/documentApi";

const FilterMenu = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { templates, filtersOpen, activeBoardId } = useAppSelector((state) => ({
    documents: state.documents.data,
    templates: state.templates.data,
    filtersOpen: state.filters.filtersOpen,
    activeBoardId: state.boards.activeBoard?.id,
  }));

  const uniqueFields = useMemo<IField[]>(() => {
    const uniqueFields = [];

    const uniqueFieldLabels = new Set();

    for (const template of templates) {
      for (const field of template.fields) {
        if (
          !uniqueFieldLabels.has(field.label) &&
          field.type !== FieldType.Text &&
          field.type !== FieldType.Textarea
        ) {
          uniqueFields.push(field);
          uniqueFieldLabels.add(field.label);
        }
      }
    }

    return uniqueFields;
  }, [templates]);

  const form = useForm({
    initialValues: {},
  });

  const SheetFilterDropdown = () => {
    return (
      <Menu.Dropdown>
        <Card>Sheet Filters</Card>
      </Menu.Dropdown>
    );
  };

  const handleSubmit = (values: any) => {
    if (!activeBoardId) return;
    dispatch(getDocuments({ boardId: activeBoardId, query: values }));
  };

  return (
    <div>
      <Menu
        withinPortal
        opened={filtersOpen}
        onClose={() => dispatch(toggleFilterOpen())}
        onOpen={() => dispatch(toggleFilterOpen())}
      >
        <Menu.Target>
          <Button size="xs" leftIcon={<IconFilter />}>
            {Object.keys(form.values).length > 0 && (
              <Badge>{Object.keys(form.values).length}</Badge>
            )}
          </Button>
        </Menu.Target>

        {(location.pathname === "/board" || location.pathname === "/board/analytics") && (
          <Menu.Dropdown>
            <Card>
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                  {uniqueFields.map((f) => {
                    return <DynamicField field={f} key={f.id} form={form} />;
                  })}
                  <Group position="right">
                    <Button
                      onClick={() => {
                        form.reset();
                        if (activeBoardId) {
                          dispatch(getDocuments({ boardId: activeBoardId, query: {} }));
                        }
                        dispatch(toggleFilterOpen());
                      }}
                    >
                      {t("clearFilters")}
                    </Button>
                    <Button variant="filled" type="submit">
                      {t("filter")}
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Card>
          </Menu.Dropdown>
        )}
        {location.pathname === "/board/sheets" && <SheetFilterDropdown />}
      </Menu>
    </div>
  );
};

export default FilterMenu;
