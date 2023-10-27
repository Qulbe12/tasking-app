import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { IconFilter, IconX } from "@tabler/icons";
import React, { useEffect, useMemo, useState } from "react";

import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { FieldType, IField } from "../interfaces/documents/IField";

import DynamicField from "./DynamicField";
import { useForm } from "@mantine/form";
import { toggleFilterOpen } from "../redux/slices/filterSlice";
import { getDocuments } from "../redux/api/documentApi";

const FilterMenu = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { templates, filtersOpen, activeBoardId } = useAppSelector((state) => ({
    documents: state.documents.data,
    templates: state.templates.data,
    filtersOpen: state.filters.filtersOpen,
    activeBoardId: state.boards.activeBoard?.id,
  }));

  const [selectedFilters, setSelectedFilters] = useState<IField[]>([]);

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

  useEffect(() => {
    if (!activeBoardId) return;
    if (selectedFilters.length <= 0) {
      dispatch(getDocuments({ boardId: activeBoardId, query: {} }));
    }

    console.log(form.values);
    // 2023-10-15T19:00:00.000Z
    // 2023-10-15T19:00:00.000Z
    // 2023-10-15T19:00:00.000Z

    handleSubmit(form.values);
  }, [form.values, selectedFilters]);

  return (
    <div>
      <Button size="xs" leftIcon={<IconFilter />} onClick={() => dispatch(toggleFilterOpen())}>
        {selectedFilters.length > 0 && <Badge color="orange">{selectedFilters.length}</Badge>}
      </Button>

      <Modal opened={filtersOpen} onClose={() => dispatch(toggleFilterOpen())}>
        <Stack>
          {selectedFilters.length <= 0 && <Text>Please add a filter</Text>}
          {selectedFilters.map((f) => {
            return (
              <Flex justify="space-between" align="end" key={f.id} gap="md">
                <DynamicField field={f} form={form} />
                <ActionIcon
                  size="sm"
                  color="red"
                  onClick={() => {
                    setSelectedFilters((filters) => filters.filter((filter) => f.id !== filter.id));
                    const newValues: any = { ...form.values };
                    delete newValues[f.key];
                    form.setValues(newValues);
                  }}
                >
                  <IconX />
                </ActionIcon>
              </Flex>
            );
          })}
        </Stack>
        <Group mt="md">
          <Button
            onClick={() => {
              setSelectedFilters([]);
              form.reset();
            }}
          >
            Clear Filters
          </Button>
          <Menu withinPortal>
            <Menu.Target>
              <Button size="xs" leftIcon={<IconFilter />}>
                Add Filter
              </Button>
            </Menu.Target>

            {(location.pathname === "/board" || location.pathname === "/board/analytics") && (
              <Menu.Dropdown>
                {uniqueFields.map((f) => {
                  if (selectedFilters.includes(f)) return;
                  return (
                    <Menu.Item
                      key={f.id + "OptionToSelect"}
                      onClick={() => {
                        setSelectedFilters((filters) => [...filters, f]);
                        form.setValues({
                          [f.key]:
                            f.type === FieldType.Number
                              ? 0
                              : f.type === FieldType.Date
                              ? new Date().toDateString()
                              : f.type === FieldType.Checkbox
                              ? true
                              : f.type === FieldType.Multiselect
                              ? f.options[0]
                              : f.type === FieldType.Radio
                              ? false
                              : f.type === FieldType.Select
                              ? f.options[0]
                              : "",
                        });
                      }}
                    >
                      {f.label}
                    </Menu.Item>
                  );
                })}
              </Menu.Dropdown>
            )}
            {location.pathname === "/board/sheets" && <SheetFilterDropdown />}
          </Menu>
        </Group>
      </Modal>
    </div>
  );
};

export default FilterMenu;
