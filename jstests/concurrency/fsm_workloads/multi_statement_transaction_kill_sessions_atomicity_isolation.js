/**
 * Tests periodically killing sessions that are running transactions.
 *
 * @tags: [uses_transactions, assumes_snapshot_transactions, kills_random_sessions]
 */

import {extendWorkload} from "jstests/concurrency/fsm_libs/extend_workload.js";
import {
    $config as $baseConfig
} from "jstests/concurrency/fsm_workloads/multi_statement_transaction_atomicity_isolation.js";
load('jstests/concurrency/fsm_workload_helpers/kill_session.js');  // for killSession

export const $config = extendWorkload($baseConfig, ($config, $super) => {
    $config.data.retryOnKilledSession = true;

    $config.states.killSession = killSession;

    $config.transitions = {
        init: {update: 0.9, checkConsistency: 0.1},
        update: {update: 0.8, checkConsistency: 0.1, killSession: 0.1},
        checkConsistency: {update: 0.9, killSession: 0.1},
        killSession: {update: 0.8, checkConsistency: 0.1, causalRead: 0.1},
        causalRead: {update: 0.9, killSession: 0.1},
    };

    return $config;
});
