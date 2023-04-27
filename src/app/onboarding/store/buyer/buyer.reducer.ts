import { Action, createReducer, on } from '@ngrx/store';
import { Sort } from '@angular/material/sort';
import { pick } from 'lodash';

import { Buyer, BuyerEntity, buyerEntityProps, BuyerForm, BuyerInvoices, BuyerGroup, BuyerSanctions, BuyerDummy, BuyerSaml } from './buyer.model';
import * as BuyerActions from './buyer.actions';
import { TypedAction } from '@ngrx/store/src/models';

import { OnboardingBaseState } from '../../onboarding.model';

export const buyerFeatureKey = 'buyer';

export interface State extends OnboardingBaseState<Buyer> {
  value: BuyerForm;
}

export const initialState: State = {
  value: {
    _id: null,
    entity: {} as BuyerEntity,
    invoices: {} as BuyerInvoices,
    group: {
      _id: '',
      acceptGroupEntityDefinition: false,
      customGroupEntityDefinition: '',
      buyerCompanyId: '',
      creatingNew: false,
      company: {
        entity: {} as BuyerEntity,
        invoices: {} as BuyerInvoices
      }
    },
    sanctions: {} as BuyerSanctions,
    dummy: {} as BuyerDummy,
    saml: {} as BuyerSaml
  },
};

export const reducer = createReducer(
  initialState,
  on(BuyerActions.setCustomerOnboarding,
    (state, { customer }) => ({
      value: {
        ...state.value,
        ...customer,
        entity: {
          ...state.value.entity,
          ...customer
        }
      }
    })
  ),
  on(BuyerActions.unsetCustomerOnboarding,
    (state) => ({
      ...initialState
    })
  ),
  on(BuyerActions.createBuyerOnboardingSuccess,
    (state, { buyer }) => ({
      value: {
        ...state.value,
        _id: buyer._id,
        entity: {
          ...state.value.entity,
          ...buyer
        },
        group: {
          ...state.value.group,
          buyerCompanyId: buyer._id
        }
      }
    })
  ),
  on(BuyerActions.patchBuyerOnboardingSuccess,
    (state, { buyer, step }) => ({
      value: {
        ...state.value,
        [step]: {
          ...state.value[step],
          ...buyer
        }
      }
    })
  ),
  on(BuyerActions.createBuyerCompanyOnboardingSuccess,
    (state, { buyer, buyerId }) => ({
      value: {
        ...state.value,
        group: {
          ...state.value.group,
          buyerCompanyId: buyerId,
          company: {
            ...state.value.group.company,
            entity: buyer as BuyerEntity
          }
        }
      }
    })
  ),
  on(BuyerActions.patchBuyerCompanyOnboardingSuccess,
    (state, { buyer, step }) => ({
      value: {
        ...state.value,
        group: {
          ...state.value.group,
          company: {
            ...state.value.group.company,
            [step]: buyer
          }
        }
      }
    })
  ),
);
