-- WealthBridgeCM rebrand.
-- 1) Promote the owner account to administrator.
-- 2) Store the new site name.
-- 3) The two receipt templates carried the previous brand hardcoded in their markup.
-- Idempotent: safe to re-run.

-- 1) Administrator account (role rows are unique per user + role).
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = lower('managementltdfund@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Site name shown in emails and used as {{site_name}} across templates.
UPDATE public.app_settings
SET site_name = 'WealthBridgeCM'
WHERE id = 1;

-- 3) Receipt templates: replace the previous brand in every text column.
UPDATE public.email_templates
SET subject     = replace(replace(subject, 'Fidelity', 'WealthBridgeCM'), 'FIDELITY', 'WEALTHBRIDGECM'),
    subject_fr  = replace(replace(subject_fr, 'Fidelity', 'WealthBridgeCM'), 'FIDELITY', 'WEALTHBRIDGECM'),
    html_body   = replace(replace(html_body, 'Fidelity', 'WealthBridgeCM'), 'FIDELITY', 'WEALTHBRIDGECM'),
    html_body_fr = replace(replace(html_body_fr, 'Fidelity', 'WealthBridgeCM'), 'FIDELITY', 'WEALTHBRIDGECM'),
    updated_at  = now()
WHERE key IN ('deposit_receipt', 'withdrawal_receipt');
