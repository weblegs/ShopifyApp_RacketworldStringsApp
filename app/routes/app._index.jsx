import { useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const stringsGroups = await db.stringsGroup.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { stringsGroups };
};

export const action = async ({ request }) => {
  await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    await db.stringsGroup.create({
      data: {
        groupName: formData.get("groupName"),
        productId: formData.get("productId"),
        tennisMains: formData.get("tennisMains"),
        tennisCrosses: formData.get("tennisCrosses"),
        stencilText: formData.get("stencilText"),
      },
    });
  } else if (intent === "update") {
    await db.stringsGroup.update({
      where: { id: Number(formData.get("id")) },
      data: {
        groupName: formData.get("groupName"),
        productId: formData.get("productId"),
        tennisMains: formData.get("tennisMains"),
        tennisCrosses: formData.get("tennisCrosses"),
        stencilText: formData.get("stencilText"),
      },
    });
  } else if (intent === "delete") {
    await db.stringsGroup.delete({
      where: { id: Number(formData.get("id")) },
    });
  }

  return null;
};

const EMPTY_FORM = {
  groupName: "",
  productId: "",
  tennisMains: "",
  tennisCrosses: "",
  stencilText: "",
};

export default function Index() {
  const { stringsGroups } = useLoaderData();
  const fetcher = useFetcher();

  const [modal, setModal] = useState(null); // null | { mode: "create" } | { mode: "edit", group }
  const [form, setForm] = useState(EMPTY_FORM);

  const isBusy = fetcher.state !== "idle";

  function openCreate() {
    setForm(EMPTY_FORM);
    setModal({ mode: "create" });
  }

  function openEdit(group) {
    setForm({
      groupName: group.groupName,
      productId: group.productId,
      tennisMains: group.tennisMains,
      tennisCrosses: group.tennisCrosses,
      stencilText: group.stencilText,
    });
    setModal({ mode: "edit", group });
  }

  function closeModal() {
    setModal(null);
  }

  function handleField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit() {
    const data = {
      intent: modal.mode === "create" ? "create" : "update",
      ...form,
      ...(modal.mode === "edit" ? { id: modal.group.id } : {}),
    };
    fetcher.submit(data, { method: "POST" });
    closeModal();
  }

  function handleDelete(id) {
    fetcher.submit({ intent: "delete", id }, { method: "POST" });
  }

  return (
    <s-page heading="Strings Groups">
      <s-button slot="primary-action" onClick={openCreate}>
        Add Vendor
      </s-button>

      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <img
          src="https://cdn.shopify.com/s/files/1/0830/3512/8126/files/weblegslogo.avif?v=1772532645"
          alt="Weblegs Logo"
          style={{ height: "50px" }}
        />
      </div>

      <s-section>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Vendor Name", "SKU", "Tennis Mains", "Tennis Crosses", "Stencil Text", "Actions"].map(
                  (h) => (
                    <th key={h} style={styles.th}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {stringsGroups.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...styles.td, textAlign: "center", color: "#6d7175" }}>
                    No vendors yet. Click <strong>Add Vendor</strong> to create one.
                  </td>
                </tr>
              ) : (
                stringsGroups.map((group) => (
                  <tr key={group.id} style={styles.tr}>
                    <td style={styles.td}>{group.groupName}</td>
                    <td style={styles.td}>{group.productId}</td>
                    <td style={styles.td}>{group.tennisMains}</td>
                    <td style={styles.td}>{group.tennisCrosses}</td>
                    <td style={styles.td}>{group.stencilText}</td>
                    <td style={styles.td}>
                      <s-button variant="tertiary" onClick={() => openEdit(group)}>
                        Edit
                      </s-button>{" "}
                      <s-button
                        variant="tertiary"
                        tone="critical"
                        onClick={() => handleDelete(group.id)}
                        disabled={isBusy}
                      >
                        Delete
                      </s-button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </s-section>

      {modal && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {modal.mode === "create" ? "Add Vendor" : "Edit Vendor"}
            </h2>

            <label style={styles.label}>Vendor Name</label>
            <input
              style={styles.input}
              value={form.groupName}
              onChange={handleField("groupName")}
              autoComplete="off"
            />

            <label style={styles.label}>Product SKU</label>
            <input
              style={styles.input}
              value={form.productId}
              onChange={handleField("productId")}
              autoComplete="off"
            />

            <label style={styles.label}>Tennis Mains</label>
            <input
              style={styles.input}
              value={form.tennisMains}
              onChange={handleField("tennisMains")}
              autoComplete="off"
            />

            <label style={styles.label}>Tennis Crosses</label>
            <input
              style={styles.input}
              value={form.tennisCrosses}
              onChange={handleField("tennisCrosses")}
              autoComplete="off"
            />

            <label style={styles.label}>Stencil Text</label>
            <input
              style={styles.input}
              value={form.stencilText}
              onChange={handleField("stencilText")}
              autoComplete="off"
            />

            <div style={styles.modalActions}>
              <s-button onClick={closeModal} variant="tertiary">
                Cancel
              </s-button>
              <s-button onClick={handleSubmit} disabled={isBusy}>
                {modal.mode === "create" ? "Create" : "Save"}
              </s-button>
            </div>
          </div>
        </div>
      )}
    </s-page>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "2px solid #e1e3e5",
    fontWeight: 600,
    color: "#202223",
  },
  tr: {
    borderBottom: "1px solid #e1e3e5",
  },
  td: {
    padding: "10px 12px",
    verticalAlign: "middle",
    color: "#202223",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modalBox: {
    background: "#fff",
    borderRadius: "8px",
    padding: "24px",
    width: "480px",
    maxWidth: "95vw",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  modalTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
    fontWeight: 600,
    color: "#202223",
  },
  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#202223",
    marginTop: "4px",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #c9cccf",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "16px",
  },
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
